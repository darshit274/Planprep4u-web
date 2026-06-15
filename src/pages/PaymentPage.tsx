import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  WalletIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentOrder {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    amount: number;
    currency: string;
    receiptId: string;
    keyId: string;
    itemDetails: {
      name: string;
      type: string;
      price: number;
    };
    subscriptionId: string;
    userDetails: {
      name: string;
      email: string;
      contact: string;
    };
  };
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  recommended?: boolean;
}

const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Get parameters from URL or location state (for PDFs)
  const state = location.state as any;
  const seriesId = searchParams.get('seriesId') || state?.item?.id;
  const title = searchParams.get('title') || state?.title || state?.item?.title || 'Item';
  const price = Number(searchParams.get('price')) || state?.amount || state?.item?.discountedPrice || state?.item?.originalPrice || state?.item?.price || 0;
  const type = searchParams.get('type') || state?.type || 'test-series';
  const itemDetails = state?.item;
  const description = state?.description || itemDetails?.description;

  console.log('PaymentPage received data:', {
    searchParams: Object.fromEntries(searchParams.entries()),
    state,
    calculatedPrice: price,
    priceComponents: {
      fromParams: searchParams.get('price'),
      fromStateAmount: state?.amount,
      fromItemDiscounted: state?.item?.discountedPrice,
      fromItemOriginal: state?.item?.originalPrice,
      fromItemPrice: state?.item?.price
    }
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Credit Card, Debit Card, Net Banking, UPI',
      icon: CreditCardIcon,
      recommended: true
    }
  ];

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      if (window.Razorpay) {
        setIsScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      script.onerror = () => {
        toast.error('Failed to load payment gateway');
        setIsScriptLoaded(false);
      };
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  const createPaymentOrder = async (): Promise<PaymentOrder> => {
    let requestBody;

    if (type === 'pdf_folder') {
      requestBody = { pdfFolderId: seriesId, planType: 'pdf_folder' };
    } else if (type === 'pdf') {
      requestBody = { pdfId: seriesId, planType: 'pdf_purchase' };
    } else {
      requestBody = { testSeriesId: seriesId, planType: 'test_series' };
    }

    const response = await api.post('/payments/create-order', requestBody);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create payment order');
    }

    return response.data;
  };

  const verifyPayment = async (paymentData: any, subscriptionId: string) => {
    const response = await api.post('/payments/verify-payment', {
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature,
      subscription_id: subscriptionId
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Payment verification failed');
    }

    return response.data;
  };

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      toast.error('Payment gateway is not ready. Please try again.');
      return;
    }

    if (!seriesId || price <= 0) {
      toast.error('Invalid payment details');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create payment order
      console.log('Creating payment order...');
      const orderData = await createPaymentOrder();
      console.log('Payment order created:', orderData);

      // Step 2: Initialize Razorpay with user details from API
      console.log('🔐 Using user details for Razorpay prefill:', orderData.data.userDetails);

      const options = {
        key: orderData.data.keyId,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        order_id: orderData.data.orderId,
        name: 'PlanPrep4u',
        description: `Payment for ${orderData.data.itemDetails.name}`,
        image: '/favicon.ico',
        handler: async function (response: any) {
          console.log('Payment successful:', response);

          try {
            // Step 3: Verify payment
            const verifyResult = await verifyPayment(response, orderData.data.subscriptionId);
            console.log('Payment verified:', verifyResult);

            if (type === 'pdf_folder') {
              toast.success('Payment successful! You now have access to all PDFs in this folder.');
              setTimeout(() => { navigate('/pdfs'); }, 2000);
            } else if (type === 'pdf') {
              toast.success('Payment successful! You now have access to this PDF.');
              setTimeout(() => { navigate('/pdfs'); }, 2000);
            } else {
              toast.success('Payment successful! Your subscription is now active.');
              // Redirect back to test series page
              setTimeout(() => {
                navigate('/tests');
              }, 2000);
            }

          } catch (verifyError: any) {
            console.error('Payment verification failed:', verifyError);
            toast.error(verifyError.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: orderData?.data?.userDetails?.name || 'User',
          email: orderData?.data?.userDetails?.email || 'user@example.com',
          contact: orderData?.data?.userDetails?.contact || '9999999999'
        },
        notes: {
          series_id: seriesId,
          plan_type: type
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function () {
            console.log('Payment modal closed');
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment failed:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 mr-3"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {type === 'pdf' ? 'PDF Document Purchase' : 'Test Series Subscription'}
                </p>
                {description && (
                  <p className="text-sm text-gray-600 mb-4">{description}</p>
                )}

              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-medium text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">₹{price}</span>
                </div>

              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Select Payment Method</h2>

              <div className="space-y-4 mb-8">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${selectedPaymentMethod === method.id
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${selectedPaymentMethod === method.id
                        ? 'bg-primary-100'
                        : 'bg-gray-100'
                        }`}>
                        <method.icon className={`h-5 w-5 ${selectedPaymentMethod === method.id
                          ? 'text-primary-600'
                          : 'text-gray-600'
                          }`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium text-gray-900 mr-2">{method.name}</h3>
                          {method.recommended && (
                            <span className="px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === method.id
                        ? 'border-primary-500'
                        : 'border-gray-300'
                        }`}>
                        {selectedPaymentMethod === method.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Notice */}
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg mb-8">
                <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-gray-600">
                  Your payment is secured with 256-bit SSL encryption
                </span>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || !isScriptLoaded}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white text-lg transition-all duration-200 ${isProcessing || !isScriptLoaded
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800'
                  }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : !isScriptLoaded ? (
                  'Loading Payment Gateway...'
                ) : (
                  `Pay ₹${price}`
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>

            {/* Error State */}
            {!seriesId && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-sm font-medium text-red-800">
                    Invalid payment request. Please try again from the test series page.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;