import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

interface ReportQuestionModalProps {
  questionId: number;
  questionNumber: number;
  userAnswer?: string;
  onClose: () => void;
}

type ReportType = 'wrong_question' | 'wrong_solution' | 'other';

const ReportQuestionModal: React.FC<ReportQuestionModalProps> = ({
  questionId,
  questionNumber,
  userAnswer,
  onClose,
}) => {
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [reportText, setReportText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickReport = async (type: 'wrong_question' | 'wrong_solution') => {
    setIsSubmitting(true);
    try {
      await api.post(`/questions/${questionId}/report`, {
        reportType: type,
        reportText: null,
        userSelectedAnswer: userAnswer || null,
      });

      toast.success('Thank you! We\'ll review your feedback shortly.', {
        duration: 4000,
        icon: '✅',
      });
      onClose();
    } catch (error: any) {
      console.error('Error submitting report:', error);

      if (error.response?.status === 429) {
        toast.error('You can only submit 5 reports per hour. Please try again later.', {
          duration: 5000,
        });
      } else if (error.response?.status === 401) {
        toast.error('Please log in to report questions', {
          duration: 4000,
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit report. Please try again.', {
          duration: 4000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomReport = async () => {
    if (!reportText.trim()) {
      toast.error('Please describe the issue', {
        duration: 3000,
      });
      return;
    }

    if (reportText.length > 500) {
      toast.error('Report text cannot exceed 500 characters', {
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/questions/${questionId}/report`, {
        reportType: 'other',
        reportText: reportText.trim(),
        userSelectedAnswer: userAnswer || null,
      });

      toast.success('Thank you! We\'ll review your feedback shortly.', {
        duration: 4000,
        icon: '✅',
      });
      onClose();
    } catch (error: any) {
      console.error('Error submitting report:', error);

      if (error.response?.status === 429) {
        toast.error('You can only submit 5 reports per hour. Please try again later.', {
          duration: 5000,
        });
      } else if (error.response?.status === 401) {
        toast.error('Please log in to report questions', {
          duration: 4000,
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit report. Please try again.', {
          duration: 4000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Report Question {questionNumber}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Help us improve! What's wrong with this question?
        </p>

        {/* Quick report buttons */}
        <div className="flex flex-col gap-3 mb-4">
          <button
            onClick={() => handleQuickReport('wrong_question')}
            disabled={isSubmitting}
            className="w-full py-3 px-4 text-left border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
              ❌ Wrong Question
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Question or options are incorrect
            </p>
          </button>

          <button
            onClick={() => handleQuickReport('wrong_solution')}
            disabled={isSubmitting}
            className="w-full py-3 px-4 text-left border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
              📖 Wrong Solution
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Solution or explanation is incorrect
            </p>
          </button>
        </div>

        <div className="text-center text-gray-400 text-sm mb-4">OR</div>

        {/* Other issue */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Issue:
          </label>
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Please describe the issue... (max 500 characters)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all"
            rows={4}
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-1">
            <span className={`text-xs ${reportText.length > 450 ? 'text-orange-500 font-medium' : 'text-gray-500'}`}>
              {reportText.length}/500 characters
            </span>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleCustomReport}
            disabled={reportText.length === 0 || isSubmitting}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ReportQuestionModal;
