import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  TrophyIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  Squares2X2Icon,
  XMarkIcon,
  FlagIcon,
  MinusCircleIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';
import HTMLContent from '../../components/common/HTMLContent';
import ReportQuestionButton from '../../components/tests/ReportQuestionButton';
import '../../styles/html-content.css';

interface Question {
  id: number;
  uuid: string;
  question_text: string;
  question_text_gujarati?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
  explanation?: string;
  explanation_gujarati?: string;
  marks: number;
}

interface SolutionsData {
  category: {
    id: number;
    uuid: string;
    name: string;
    name_gujarati?: string;
    description?: string;
    description_gujarati?: string;
  };
  solutions: Question[];
  metadata: {
    total_questions: number;
    language: string;
  };
}

const SolutionsPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [solutionsData, setSolutionsData] = useState<SolutionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Expandable explanations state
  const [showExplanations, setShowExplanations] = useState<{ [key: number]: boolean }>({});
  const [showAllExplanations, setShowAllExplanations] = useState(false);

  // Retake/Practice mode state - ON by default
  const [practiceMode, setPracticeMode] = useState(true);
  const [reattemptAnswers, setReattemptAnswers] = useState<{ [key: number]: string }>({});
  const [hasReattempted, setHasReattempted] = useState<{ [key: number]: boolean }>({});

  // Navigator modal state
  const [showNavigator, setShowNavigator] = useState(false);

  // Get sessionId from URL query parameter (?session=xxx)
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session');

  // Get quiz result data from location state (used for immediate solutions after submission)
  const {
    categoryName,
    userAnswers: locationUserAnswers,
    markedQuestions: locationMarkedQuestions = {},
    score: locationScore,
    percentage: locationPercentage,
    language = 'english'
  } = location.state || {};

  // State to hold session-based data (when viewing from test history)
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>(locationUserAnswers || {});
  const [markedQuestions, setMarkedQuestions] = useState<{ [key: number]: boolean }>(locationMarkedQuestions || {});
  const [score, setScore] = useState<number>(locationScore || 0);
  const [percentage, setPercentage] = useState<number>(locationPercentage || 0);

  // Helper function to convert newlines to HTML br tags
  const formatTextWithLineBreaks = (text: string): string => {
    if (!text) return '';
    // Replace \n with <br> tags to preserve line breaks
    return text?.replace(/\n/g, '<br>');
  };

  useEffect(() => {
    if (sessionId) {
      // Viewing from test history - fetch session-based solutions
      fetchSessionSolutions(sessionId);
    } else if (uuid) {
      // Immediate view after submission - fetch category-based solutions
      fetchSolutions();
    }
  }, [uuid, sessionId]);

  // Fetch session-based solutions (from test history)
  const fetchSessionSolutions = async (sessionId: string) => {
    try {
      console.log('📜 Fetching session-based solutions for sessionId:', sessionId);

      const response = await api.get(`/test-history/${sessionId}/solutions`);

      console.log('Session API Response:', response);

      if (response.data.success) {
        const data = response.data.data;

        // Map the session solutions to our component format
        const mappedSolutions = data.solutions.map((sol: any) => ({
          id: sol.questionId,
          uuid: sol.questionUuid || '',
          question_text: sol.questionText,
          question_text_gujarati: sol.questionTextGujarati,
          options: sol.options,
          correct_answer: sol.correctAnswer,
          explanation: sol.explanation,
          explanation_gujarati: sol.explanationGujarati,
          marks: sol.marks
        }));

        setSolutionsData({
          category: {
            id: 0,
            uuid: uuid || '',
            name: data.categoryName || categoryName || 'Test',
            name_gujarati: '',
            description: '',
            description_gujarati: ''
          },
          solutions: mappedSolutions,
          metadata: {
            total_questions: data.totalQuestions,
            language: language
          }
        });

        // Build userAnswers and markedQuestions from session data
        const sessionUserAnswers: { [key: number]: string } = {};
        const sessionMarkedQuestions: { [key: number]: boolean } = {};
        let correctCount = 0;

        data.solutions.forEach((sol: any, index: number) => {
          if (sol.userAnswer) {
            sessionUserAnswers[index] = sol.userAnswer;
          }
          if (sol.isMarked) {
            sessionMarkedQuestions[index] = true;
          }
          if (sol.isCorrect) {
            correctCount++;
          }
        });

        setUserAnswers(sessionUserAnswers);
        setMarkedQuestions(sessionMarkedQuestions);
        setScore(correctCount);
        setPercentage(Math.round((correctCount / data.totalQuestions) * 100));

        console.log('✅ Session solutions loaded:', {
          userAnswers: sessionUserAnswers,
          markedQuestions: sessionMarkedQuestions,
          score: correctCount
        });
      } else {
        console.error('Session API returned success: false', response.data);
        toast.error(response.data.message || 'Failed to load session solutions');
      }
    } catch (error: any) {
      console.error('Failed to fetch session solutions:', error);
      toast.error('Failed to load solutions from test history');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch category-based solutions (immediate after submission)
  const fetchSolutions = async () => {
    try {
      console.log('Fetching solutions for UUID:', uuid);
      console.log('API URL:', `/test-history/${uuid}/solutions`);
      console.log('Using language:', language);

      const response = await api.get(`/test-history/${uuid}/solutions`, {
        params: {
          language: language || 'english'
        }
      });

      console.log('API Response:', response);
      console.log('Response data:', response.data);

      if (response.data.success) {
        setSolutionsData(response.data.data);
        console.log('Solutions data set:', response.data.data);
      } else {
        console.error('API returned success: false', response.data);
        toast.error(response.data.message || 'Failed to load solutions');
      }
    } catch (error: any) {
      console.error('Failed to fetch solutions - Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);

      const errorMessage = error.response?.data?.message || error.message || 'Failed to load solutions';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading solutions...</p>
        </div>
      </div>
    );
  }

  if (!solutionsData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">No solutions found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = solutionsData.solutions[currentQuestionIndex];
  const userAnswer = userAnswers ? userAnswers[currentQuestionIndex] : null;
  const isCorrect = userAnswer === currentQuestion?.correct_answer;

  // Helper function to determine question status with badges
  const getQuestionStatus = (questionIndex: number) => {
    if (!solutionsData) return null;

    const question = solutionsData.solutions[questionIndex];
    const answer = userAnswers ? userAnswers[questionIndex] : null;
    const isMarked = markedQuestions ? markedQuestions[questionIndex] === true : false;

    // Not attempted
    if (!answer) {
      return {
        type: 'not-attempted',
        isCorrect: false,
        isMarked: isMarked,
        label: 'Not Attempted',
        badgeClass: 'bg-gray-100 text-gray-700 border border-gray-300',
        iconClass: 'text-gray-500',
        iconBgClass: 'bg-gray-100'
      };
    }

    // Correct
    if (answer === question.correct_answer) {
      return {
        type: 'correct',
        isCorrect: true,
        isMarked: isMarked,
        label: 'Correct',
        badgeClass: 'bg-green-100 text-green-800 border border-green-300',
        iconClass: 'text-green-600',
        iconBgClass: 'bg-green-100'
      };
    }

    // Incorrect
    return {
      type: 'incorrect',
      isCorrect: false,
      isMarked: isMarked,
      label: 'Incorrect',
      badgeClass: 'bg-red-100 text-red-800 border border-red-300',
      iconClass: 'text-red-600',
      iconBgClass: 'bg-red-100'
    };
  };

  // Get current question status
  const currentStatus = getQuestionStatus(currentQuestionIndex);

  // Helper functions
  const toggleExplanation = (questionIndex: number) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };

  const toggleAllExplanations = () => {
    const newState = !showAllExplanations;
    setShowAllExplanations(newState);

    if (solutionsData) {
      const allExplanations: { [key: number]: boolean } = {};
      solutionsData.solutions.forEach((_, index) => {
        allExplanations[index] = newState;
      });
      setShowExplanations(allExplanations);
    }
  };

  const handleReattempt = (questionIndex: number, selectedOption: string) => {
    const question = solutionsData?.solutions[questionIndex];
    if (!question) return;

    setReattemptAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));

    setHasReattempted(prev => ({
      ...prev,
      [questionIndex]: true
    }));

    // Show explanation after reattempt
    setShowExplanations(prev => ({
      ...prev,
      [questionIndex]: true
    }));
  };

  const resetQuestion = (questionIndex: number) => {
    setReattemptAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionIndex];
      return newAnswers;
    });

    setHasReattempted(prev => ({
      ...prev,
      [questionIndex]: false
    }));

    setShowExplanations(prev => ({
      ...prev,
      [questionIndex]: false
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 mr-3"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Solutions</h1>
              <p className="text-sm text-gray-500">
                {categoryName} • Question {currentQuestionIndex + 1} of {solutionsData.solutions.length}
              </p>
            </div>
          </div>

          {/* Score Display and Navigator Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNavigator(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
              title="Question Navigator"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-500">Your Score</p>
              <p className="text-lg font-semibold text-gray-900">
                {score}/{solutionsData.solutions.length} ({percentage}%)
              </p>
            </div>
            <div className="flex items-center">
              <TrophyIcon className={`h-6 w-6 ${percentage >= 70 ? 'text-green-600' :
                percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Practice Mode Toggle */}
              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={practiceMode}
                    onChange={(e) => setPracticeMode(e.target.checked)}
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${practiceMode ? 'bg-primary-600' : 'bg-gray-200'
                    }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${practiceMode ? 'translate-x-5' : 'translate-x-0.5'
                      } mt-0.5`} />
                  </div>
                </label>
                <span className="text-sm font-medium text-gray-700">
                  Practice Mode {practiceMode ? 'ON' : 'OFF'}
                </span>
                <ArrowPathIcon className={`h-4 w-4 ${practiceMode ? 'text-primary-600' : 'text-gray-400'
                  }`} />
              </div>
            </div>

            {/* Show All/Hide All Explanations */}
            <button
              onClick={toggleAllExplanations}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showAllExplanations ? (
                <>
                  <EyeSlashIcon className="h-4 w-4" />
                  <span>Hide All Explanations</span>
                </>
              ) : (
                <>
                  <EyeIcon className="h-4 w-4" />
                  <span>Show All Explanations</span>
                </>
              )}
            </button>
          </div>

          {practiceMode && (
            <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-sm text-primary-800">
                <strong>Practice Mode:</strong> Click on any option to reattempt wrong answers.
                Explanations will be revealed after you make your choice.
              </p>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Progress</span>
            <span className="text-sm text-gray-500">
              {currentQuestionIndex + 1} / {solutionsData.solutions.length}
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / solutionsData.solutions.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-6">
          {/* Question Header with Dynamic Status Badges */}
          <div className="flex items-start space-x-4 mb-6">
            {/* Status Icon */}
            <div className="flex-shrink-0">
              {currentStatus && currentStatus.type === 'correct' && (
                <div className={`w-12 h-12 ${currentStatus.iconBgClass} rounded-full flex items-center justify-center`}>
                  <CheckCircleIcon className={`h-6 w-6 ${currentStatus.iconClass}`} />
                </div>
              )}
              {currentStatus && currentStatus.type === 'incorrect' && (
                <div className={`w-12 h-12 ${currentStatus.iconBgClass} rounded-full flex items-center justify-center`}>
                  <XCircleIcon className={`h-6 w-6 ${currentStatus.iconClass}`} />
                </div>
              )}
              {currentStatus && currentStatus.type === 'not-attempted' && (
                <div className={`w-12 h-12 ${currentStatus.iconBgClass} rounded-full flex items-center justify-center`}>
                  <MinusCircleIcon className={`h-6 w-6 ${currentStatus.iconClass}`} />
                </div>
              )}
            </div>

            <div className="flex-1">
              {/* Status Badges Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                  {/* Main Status Badge */}
                  {currentStatus && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentStatus.badgeClass}`}>
                      {currentStatus.label}
                    </span>
                  )}

                  {/* Marked for Review Badge */}
                  {currentStatus && currentStatus.isMarked && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                      <span className="inline-flex items-center">
                        <FlagIcon className="h-4 w-4 mr-1" />
                        Marked for Review
                      </span>
                    </span>
                  )}

                  {/* Marks Display */}
                  <span className="text-sm text-gray-500">
                    {currentStatus && currentStatus?.isCorrect ? '+' : ''}{currentQuestion?.marks} {currentQuestion?.marks === 1 ? 'mark' : 'marks'}
                  </span>
                </div>

                {/* Report Button */}
                <ReportQuestionButton
                  questionId={currentQuestion?.id}
                  questionNumber={currentQuestionIndex + 1}
                  userAnswer={userAnswer || undefined}
                />
              </div>

              {/* Question Text */}
              <HTMLContent
                content={formatTextWithLineBreaks(
                  language === 'gujarati' && (currentQuestion?.question_text_gujarati || currentQuestion?.questionTextGujarati)
                    ? (currentQuestion?.question_text_gujarati || currentQuestion?.questionTextGujarati)
                    : (currentQuestion?.question_text || currentQuestion?.questionText)
                )}
                className="text-xl font-medium text-gray-900"
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionText = currentQuestion?.options[option as keyof typeof currentQuestion.options];
              const isUserAnswer = userAnswer === option;
              const isCorrectAnswer = currentQuestion?.correct_answer === option;

              // Reattempt logic
              const reattemptAnswer = reattemptAnswers[currentQuestionIndex];
              const isReattemptAnswer = reattemptAnswer === option;
              const hasUserReattempted = hasReattempted[currentQuestionIndex];
              const isReattemptCorrect = isReattemptAnswer && isCorrectAnswer;
              const isReattemptIncorrect = isReattemptAnswer && !isCorrectAnswer;

              // Show original answers by default, or if user has reattempted in practice mode, or if originally correct
              const showOriginalAnswers = !practiceMode || hasUserReattempted || isCorrect;

              let optionClass = 'border-gray-200 bg-white';
              let labelClass = 'border-gray-300 text-gray-600';

              if (showOriginalAnswers) {
                if (isCorrectAnswer) {
                  optionClass = 'border-green-500 bg-green-50 text-green-900';
                  labelClass = 'border-green-500 bg-green-500 text-white';
                } else if (isUserAnswer && !isCorrectAnswer) {
                  optionClass = 'border-red-500 bg-red-50 text-red-900';
                  labelClass = 'border-red-500 bg-red-500 text-white';
                }
              }

              // Override with reattempt styling if applicable
              if (practiceMode && hasUserReattempted) {
                if (isReattemptCorrect) {
                  optionClass = 'border-green-500 bg-green-100 text-green-900';
                  labelClass = 'border-green-500 bg-green-600 text-white';
                } else if (isReattemptIncorrect) {
                  optionClass = 'border-red-500 bg-red-100 text-red-900';
                  labelClass = 'border-red-500 bg-red-600 text-white';
                }
              }

              const isClickable = practiceMode && !hasUserReattempted && !isCorrect;

              return (
                <div
                  key={option}
                  className={`p-4 rounded-lg border transition-all ${optionClass} ${isClickable ? 'cursor-pointer hover:bg-primary-50 hover:border-primary-300' : ''
                    }`}
                  onClick={() => {
                    if (isClickable) {
                      handleReattempt(currentQuestionIndex, option);
                    }
                  }}
                >
                  <div className="flex items-start">
                    <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 ${labelClass}`}>
                      {option}
                    </span>
                    <div className="flex-1">
                      <HTMLContent
                        content={formatTextWithLineBreaks(optionText)}
                        className=""
                      />
                    </div>

                    {/* Original answer indicators */}
                    {showOriginalAnswers && isCorrectAnswer && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600 ml-2" />
                    )}
                    {showOriginalAnswers && isUserAnswer && !isCorrectAnswer && (
                      <XCircleIcon className="h-5 w-5 text-red-600 ml-2" />
                    )}

                    {/* Reattempt indicators */}
                    {practiceMode && hasUserReattempted && isReattemptAnswer && (
                      <>
                        {isReattemptCorrect && (
                          <div className="flex items-center ml-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            <span className="text-xs text-green-600 ml-1 font-medium">Reattempt ✓</span>
                          </div>
                        )}
                        {isReattemptIncorrect && (
                          <div className="flex items-center ml-2">
                            <XCircleIcon className="h-5 w-5 text-red-600" />
                            <span className="text-xs text-red-600 ml-1 font-medium">Reattempt ✗</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Practice Mode Controls - Reattempt feedback */}
          {practiceMode && hasReattempted[currentQuestionIndex] && (
            <div className="bg-primary-50 rounded-lg p-4 mb-6 border border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-primary-900">Reattempt Complete</h4>
                  <p className="text-sm text-primary-700">
                    {reattemptAnswers[currentQuestionIndex] === currentQuestion.correct_answer
                      ? '🎉 Great job! You got it right this time.'
                      : '🤔 That\'s still not correct, but you can see the explanation below.'}
                  </p>
                </div>
                <button
                  onClick={() => resetQuestion(currentQuestionIndex)}
                  className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100 rounded-md hover:bg-primary-200 transition-colors"
                >
                  <ArrowPathIcon className="h-3 w-3" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

          {/* Practice Mode Info - Already Correct */}
          {practiceMode && isCorrect && !hasReattempted[currentQuestionIndex] && (
            <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-green-900">Already Correct!</h4>
                  <p className="text-sm text-green-700">
                    You answered this question correctly. No need to reattempt. View the explanation below.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Answer Summary - Hide when Practice Mode is ON unless user has reattempted or answer is correct */}
          {(!practiceMode || hasReattempted[currentQuestionIndex] || isCorrect) && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Your Answer</p>
                  <div className={`text-lg font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {userAnswer ? (
                      <>
                        <span>{userAnswer} - </span>
                        <HTMLContent
                          content={formatTextWithLineBreaks(currentQuestion?.options[userAnswer as keyof typeof currentQuestion.options])}
                          className="inline"
                        />
                      </>
                    ) : 'Not answered'}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Correct Answer</p>
                  <div className="text-lg font-semibold text-green-600">
                    <span>{currentQuestion?.correct_answer} - </span>
                    <HTMLContent
                      content={formatTextWithLineBreaks(currentQuestion?.options[currentQuestion?.correct_answer as keyof typeof currentQuestion.options])}
                      className="inline"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Explanation */}
          {currentQuestion?.explanation && (
            <div className="bg-primary-50 rounded-lg border border-primary-200">
              {/* Explanation Header - Always Visible */}
              <button
                onClick={() => toggleExplanation(currentQuestionIndex)}
                className="w-full p-4 flex items-center justify-between hover:bg-primary-100 transition-colors rounded-t-lg"
              >
                <div className="flex items-center space-x-3">
                  <LightBulbIcon className="h-6 w-6 text-primary-600 flex-shrink-0" />
                  <h3 className="text-lg font-medium text-primary-900">
                    View Explanation
                    {practiceMode && !hasReattempted[currentQuestionIndex] && !isCorrect && (
                      <span className="text-sm font-normal text-primary-600 ml-2">
                        (Available after reattempt)
                      </span>
                    )}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  {practiceMode && !hasReattempted[currentQuestionIndex] && !isCorrect && (
                    <span className="text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded">
                      Locked
                    </span>
                  )}
                  {showExplanations[currentQuestionIndex] ? (
                    <EyeSlashIcon className="h-5 w-5 text-primary-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-primary-600" />
                  )}
                </div>
              </button>

              {/* Explanation Content - Expandable */}
              {showExplanations[currentQuestionIndex] &&
                (!practiceMode || hasReattempted[currentQuestionIndex] || isCorrect) && (
                  <div className="px-6 pb-6 border-t border-primary-200">
                    <div className="pt-4">
                      <HTMLContent
                        content={language === 'gujarati' && currentQuestion?.explanation_gujarati
                          ? currentQuestion?.explanation_gujarati
                          : currentQuestion?.explanation || ''}
                        className="text-primary-800 leading-relaxed"
                      />

                      {/* Show additional context for practice mode */}
                      {practiceMode && hasReattempted[currentQuestionIndex] && (
                        <div className="mt-4 p-3 bg-primary-100 rounded-lg">
                          <div className="text-sm text-primary-700">
                            <strong>Practice Summary:</strong>
                            <ul className="mt-2 space-y-1">
                              <li>• Original answer: {userAnswer || 'Not answered'}</li>
                              <li>• Your reattempt: {reattemptAnswers[currentQuestionIndex]}</li>
                              <li>• Correct answer: {currentQuestion.correct_answer}</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Locked state message for practice mode - only for wrong answers */}
              {practiceMode && !hasReattempted[currentQuestionIndex] && !isCorrect && showExplanations[currentQuestionIndex] && (
                <div className="px-6 pb-6 border-t border-primary-200">
                  <div className="pt-4 text-center">
                    <div className="text-primary-600 mb-2">
                      <LightBulbIcon className="h-8 w-8 mx-auto opacity-50" />
                    </div>
                    <p className="text-primary-700 text-sm">
                      Reattempt the question above to unlock the explanation
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {/* Question Numbers */}
          <div className="flex space-x-2 max-w-xs overflow-x-auto">
            {solutionsData.solutions.map((_, index) => {
              const questionUserAnswer = userAnswers ? userAnswers[index] : null;
              const questionIsCorrect = questionUserAnswer === solutionsData.solutions[index].correct_answer;

              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded text-sm font-medium flex-shrink-0 ${index === currentQuestionIndex
                    ? 'bg-primary-600 text-white'
                    : questionIsCorrect
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : questionUserAnswer
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {currentQuestionIndex === solutionsData.solutions.length - 1 ? (
            <button
              onClick={() => navigate('/test-history')}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Next
            </button>
          )}
        </div>

        {/* Question Navigator Modal */}
        {showNavigator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">
                  Question Navigator
                </h3>
                <button
                  onClick={() => setShowNavigator(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Question Grid */}
                <div className="grid grid-cols-6 md:grid-cols-8 gap-3 mb-8">
                  {solutionsData && solutionsData.solutions.map((question, index) => {
                    const isCurrentQuestion = index === currentQuestionIndex;
                    const originalUserAnswer = userAnswers ? userAnswers[index] : null;
                    const isOriginalCorrect = originalUserAnswer === question.correct_answer;
                    const hasReattemptedThis = hasReattempted[index];
                    const reattemptAnswer = reattemptAnswers[index];
                    const isReattemptCorrect = reattemptAnswer === question.correct_answer;

                    // Determine question status
                    let statusClass = '';

                    if (isCurrentQuestion) {
                      statusClass = 'border-primary-500 border-3 bg-primary-100 text-primary-800 ring-2 ring-primary-200';
                    } else if (practiceMode && hasReattemptedThis) {
                      if (isReattemptCorrect) {
                        statusClass = 'bg-green-100 text-green-800 border-2 border-green-300 hover:bg-green-200';
                      } else {
                        statusClass = 'bg-orange-100 text-orange-800 border-2 border-orange-300 hover:bg-orange-200';
                      }
                    } else if (originalUserAnswer) {
                      if (isOriginalCorrect) {
                        statusClass = 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100';
                      } else {
                        statusClass = 'bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100';
                      }
                    } else {
                      statusClass = 'bg-gray-50 text-gray-500 border-2 border-gray-200 hover:bg-gray-100';
                    }

                    return (
                      <button
                        key={question.id}
                        onClick={() => {
                          setCurrentQuestionIndex(index);
                          setShowNavigator(false);
                        }}
                        className={`w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold transition-all hover:scale-110 transform ${statusClass}`}
                        title={`Question ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                {/* <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-4 text-sm">Legend:</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-lg bg-primary-100 border-2 border-primary-500 ring-1 ring-primary-200 flex-shrink-0"></div>
                    <span className="text-gray-700">Current</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-lg bg-green-50 border-2 border-green-200 flex-shrink-0"></div>
                    <span className="text-gray-700">Correct</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-lg bg-red-50 border-2 border-red-200 flex-shrink-0"></div>
                    <span className="text-gray-700">Wrong</span>
                  </div>
                  {practiceMode && (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-lg bg-green-100 border-2 border-green-300 flex-shrink-0"></div>
                        <span className="text-gray-700">Reattempt ✓</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-lg bg-orange-100 border-2 border-orange-300 flex-shrink-0"></div>
                        <span className="text-gray-700">Reattempt ✗</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-lg bg-gray-50 border-2 border-gray-200 flex-shrink-0"></div>
                    <span className="text-gray-700">Unanswered</span>
                  </div>
                </div>
              </div> */}

                {/* Progress Statistics */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 text-base">
                    Solution Progress
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {solutionsData?.solutions.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {score || 0}
                      </div>
                      <div className="text-sm text-gray-600">Correct</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {(solutionsData?.solutions.length || 0) - (score || 0)}
                      </div>
                      <div className="text-sm text-gray-600">Wrong</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${(percentage || 0) >= 70 ? 'text-green-600' :
                        (percentage || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {percentage || 0}%
                      </div>
                      <div className="text-sm text-gray-600">Score</div>
                    </div>
                  </div>

                  {practiceMode && Object.keys(hasReattempted).length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Questions Reattempted:</span>
                        <span className="text-lg font-bold text-primary-600">
                          {Object.values(hasReattempted).filter(Boolean).length}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-6">
                    <button
                      onClick={() => setShowNavigator(false)}
                      className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
                    >
                      Continue Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionsPage;