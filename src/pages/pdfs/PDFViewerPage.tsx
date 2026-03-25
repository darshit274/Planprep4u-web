import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

// Custom PDF display component that renders PDF as blob URL for Chrome compatibility
const SecurePDFDisplay: React.FC<{ pdfDataUrl: string | null; isLoading: boolean }> = ({ pdfDataUrl, isLoading }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Create blob URL when pdfDataUrl changes
  useEffect(() => {
    if (pdfDataUrl) {
      const base64Data = pdfDataUrl.split(',')[1]; // Remove data:application/pdf;base64, prefix
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      console.log('🔧 Created blob URL:', url);
      setBlobUrl(url);

      // Cleanup function to revoke blob URL
      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    }
  }, [pdfDataUrl]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Securing PDF content...</p>
        </div>
      </div>
    );
  }

  if (!pdfDataUrl || !blobUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-800 text-white">
        <p>{!pdfDataUrl ? 'No PDF content available' : 'Preparing PDF...'}</p>
      </div>
    );
  }

  return (
    <iframe
      src={blobUrl}
      width="100%"
      height="100%"
      title="Secure PDF Viewer"
      style={{
        border: 'none',
        pointerEvents: 'auto',
        userSelect: 'none',
      }}
      onLoad={() => {
        console.log('✅ PDF loaded securely via blob URL');
      }}
      onError={() => {
        console.error('❌ PDF loading failed');
      }}
    />
  );
};

const PDFViewerPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [securityWarning, setSecurityWarning] = useState<string>('');
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Implement screenshot protection
    const preventScreenshots = () => {
      // Prevent right-click context menu
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        toast.error('Right-click is disabled for security');
        return false;
      };

      // Prevent common screenshot shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        // Prevent Print Screen
        if (e.key === 'PrintScreen') {
          e.preventDefault();
          toast.error('Screenshots are not allowed');
          return false;
        }

        // Prevent Ctrl+Shift+S (Firefox screenshot)
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
          e.preventDefault();
          toast.error('Screenshots are not allowed');
          return false;
        }

        // Prevent F12 (DevTools)
        if (e.key === 'F12') {
          e.preventDefault();
          toast.error('Developer tools are disabled');
          return false;
        }

        // Prevent Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
          e.preventDefault();
          toast.error('Developer tools are disabled');
          return false;
        }

        // Prevent Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
          e.preventDefault();
          toast.error('View source is disabled');
          return false;
        }

        // Prevent Ctrl+S (Save As)
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
          toast.error('Saving is disabled');
          return false;
        }

        // Prevent Ctrl+A (Select All)
        if (e.ctrlKey && e.key === 'a') {
          e.preventDefault();
          return false;
        }

        // Prevent Ctrl+C (Copy)
        if (e.ctrlKey && e.key === 'c') {
          e.preventDefault();
          toast.error('Copying is disabled');
          return false;
        }

        // Prevent Ctrl+P (Print)
        if (e.ctrlKey && e.key === 'p') {
          e.preventDefault();
          toast.error('Printing is disabled');
          return false;
        }
      };

      // Prevent drag and drop
      const handleDragStart = (e: DragEvent) => {
        e.preventDefault();
        return false;
      };

      // Prevent selection
      const handleSelectStart = (e: Event) => {
        e.preventDefault();
        return false;
      };

      // Add event listeners
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('dragstart', handleDragStart);
      document.addEventListener('selectstart', handleSelectStart);

      // Cleanup function
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('dragstart', handleDragStart);
        document.removeEventListener('selectstart', handleSelectStart);
      };
    };

    const cleanup = preventScreenshots();

    // Blur/hide page when user tries to take screenshot or switch tabs
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden - user might be trying to screenshot
        if (viewerRef.current) {
          viewerRef.current.style.filter = 'blur(10px)';
          viewerRef.current.style.opacity = '0.3';
        }
      } else {
        // Page is visible again
        if (viewerRef.current) {
          viewerRef.current.style.filter = 'none';
          viewerRef.current.style.opacity = '1';
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Load PDF
    loadPDF();

    return () => {
      cleanup();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [id]);

  // Cleanup PDF data on component unmount
  useEffect(() => {
    return () => {
      console.log('Clearing PDF data from memory on unmount');
      setPdfDataUrl(null);
    };
  }, []);

  const loadPDF = async () => {
    if (!id) {
      setError('PDF ID is required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSecurityWarning('');
      
      // Step 1: Check if user is authenticated (temporarily disabled for testing)
      const authToken = sessionStorage.getItem('planprep4u_token');
      const userData = sessionStorage.getItem('planprep4u_user');
      
      console.log('Auth token exists:', !!authToken);
      console.log('User data exists:', !!userData);
      
      if (!authToken) {
        throw new Error('Authentication required. Please log in first.');
      }
      
      // Step 2: Fetch PDF data using the configured API service (same as mobile app pattern)
      console.log('Fetching PDF data from secure endpoint:', id);
      
      const response = await api.get(`/pdfs/${id}/secure`);
      console.log('📡 API Response received:', response.status);
      
      if (!response.data) {
        throw new Error('No response data received');
      }

      // Parse JSON response to get base64 data
      const responseData = response.data;
      console.log('📄 Response data structure:', {
        success: responseData.success,
        hasContent: !!responseData.data?.content,
        contentLength: responseData.data?.content?.length || 0
      });
      
      if (!responseData.success || !responseData.data.content) {
        throw new Error('Invalid PDF response format');
      }

      // Use base64 data directly (no conversion needed)
      const pdfDataUrl = responseData.data.content; // This is already "data:application/pdf;base64,..."
      
      console.log('PDF data loaded securely into memory');
      setPdfDataUrl(pdfDataUrl);
      const expiryDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
      setTokenExpiry(expiryDate);
      setAccessGranted(true);
      
      // Step 3: Set up token expiry warning
      const timeToExpiry = expiryDate.getTime() - Date.now();
      const warningTime = Math.max(0, timeToExpiry - (5 * 60 * 1000)); // 5 minutes before expiry
      
      setTimeout(() => {
        if (accessGranted) {
          setSecurityWarning('PDF access will expire in 5 minutes. Please save your progress.');
          toast.warning('PDF access expiring soon!');
        }
      }, warningTime);
      
      // Step 4: Auto-logout when token expires
      setTimeout(() => {
        if (accessGranted) {
          setAccessGranted(false);
          // Clear PDF data from memory for security
          setPdfDataUrl(null);
          setError('PDF access has expired for security reasons. Please refresh to generate a new access token.');
          toast.error('PDF access expired');
        }
      }, timeToExpiry);
      
      // Step 5: Security monitoring
      const detectDevTools = () => {
        let devtools = {
          open: false,
          orientation: null
        };
        
        const threshold = 160;
        setInterval(() => {
          if (window.outerHeight - window.innerHeight > threshold || 
              window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
              devtools.open = true;
              setSecurityWarning('Developer tools detected. PDF access may be restricted.');
              toast.error('Developer tools detected - this may violate security policies');
            }
          } else {
            devtools.open = false;
          }
        }, 500);
      };
      
      detectDevTools();
      
    } catch (err: any) {
      console.error('Failed to load PDF:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      
      if (err.message?.includes('Authentication required')) {
        setError('You are not logged in. Please log in to access this PDF.');
        toast.error('Please log in to view PDFs');
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Your session may have expired. Please log in again.');
        toast.error('Session expired - please log in again');
        // Clear invalid token
        sessionStorage.removeItem('planprep4u_token');
        sessionStorage.removeItem('planprep4u_user');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (err.response?.status === 403) {
        setError('Access denied. You may need a subscription to view this PDF.');
        toast.error('PDF access denied');
      } else if (err.response?.status === 404) {
        setError('PDF not found. It may have been removed or is no longer available.');
      } else {
        setError(`Failed to load PDF securely: ${err.response?.data?.message || err.message || 'Unknown error'}`);
        toast.error('Failed to generate secure PDF access');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Additional security: Disable browser zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        toast.error('Zoom is disabled for security');
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading secure PDF viewer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-600 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <ShieldCheckIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate('/pdfs')}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Back to PDFs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Secure Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-full mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/pdfs')}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Secure PDF Viewer</span>
            </div>
            {pdfDataUrl && (
              <button
                onClick={() => {
                  // Create blob and open in new tab as fallback
                  const base64Data = pdfDataUrl.split(',')[1];
                  const binaryString = atob(base64Data);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  const blob = new Blob([bytes], { type: 'application/pdf' });
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                }}
                className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
              >
                Open in New Tab
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            {tokenExpiry && (
              <div className="flex items-center space-x-2">
                <span>Access expires:</span>
                <span className="text-yellow-400 font-mono">
                  {tokenExpiry.toLocaleTimeString()}
                </span>
              </div>
            )}
            <span>🔒 Protected Content</span>
          </div>
        </div>
      </div>

      {/* Security Warnings */}
      <div className="bg-yellow-600 text-yellow-100 p-2 text-center text-sm">
        ⚠️ This content is protected. Screenshots, downloading, and printing are disabled for security.
      </div>
      
      {securityWarning && (
        <div className="bg-red-600 text-red-100 p-3 text-center text-sm font-medium">
          <div className="flex items-center justify-center space-x-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span>{securityWarning}</span>
          </div>
        </div>
      )}

      {!accessGranted && !isLoading && !error && (
        <div className="bg-gray-800 text-gray-300 p-6 text-center">
          <div className="max-w-md mx-auto">
            <ShieldCheckIcon className="w-12 h-12 text-primary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Secure Access Required</h3>
            <p className="text-sm mb-4">
              Generating secure access token to protect this PDF from unauthorized access...
            </p>
            <button
              onClick={loadPDF}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Generate Secure Access
            </button>
          </div>
        </div>
      )}

      {/* PDF Viewer Container */}
      <div 
        ref={viewerRef}
        className="pdf-viewer-container"
        style={{
          height: 'calc(100vh - 120px)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        {pdfDataUrl ? (
          <SecurePDFDisplay pdfDataUrl={pdfDataUrl} isLoading={false} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ShieldCheckIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">PDF content is being loaded...</p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to prevent right-click on iframe */}
      <style>{`
        .pdf-viewer-container {
          position: relative;
        }
        
        .pdf-viewer-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        /* Disable text selection */
        * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Disable drag and drop */
        * {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }

        /* Hide scrollbars to prevent interaction */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default PDFViewerPage;