import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  Squares2X2Icon,
  StarIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import HTMLContent from "../../components/common/HTMLContent";

interface Question {
  id: number;
  uuid: string;
  question_text: string | null;
  question_text_gujarati?: string | null;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  option_a?: string | null;
  option_b?: string | null;
  option_c?: string | null;
  option_d?: string | null;
  option_a_gujarati?: string | null;
  option_b_gujarati?: string | null;
  option_c_gujarati?: string | null;
  option_d_gujarati?: string | null;
  correct_answer: string;
  explanation?: string | null;
  explanation_gujarati?: string | null;
  marks: number;
}

interface QuizData {
  category: {
    id: number;
    uuid: string;
    name: string;
    description?: string;
    test_duration_minutes?: number;
    negative_marking_enabled?: boolean;
    negative_marks_per_wrong?: number;
  };
  questions: Question[];
  metadata: {
    total_questions: number;
    language: string;
    shuffled: boolean;
  };
}

const TakeTestPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState<{
    [key: number]: boolean;
  }>({});
  const [language, setLanguage] = useState<"english" | "gujarati">("gujarati");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNegativeMarkingWarning, setShowNegativeMarkingWarning] =
    useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);

  // Get category info from location state
  const { categoryName, seriesName, questionCount } = location.state || {};

  // Helper function to convert newlines to HTML br tags
  const formatTextWithLineBreaks = (text: string): string => {
    if (!text) return "";
    // Replace \n with <br> tags to preserve line breaks
    return text.replace(/\n/g, "<br>");
  };

  // Smart language selection functions
  const getQuestionText = (
    question: Question,
    selectedLanguage: "english" | "gujarati"
  ): string => {
    if (selectedLanguage === "gujarati") {
      return (
        question.question_text_gujarati ||
        question.question_text ||
        "No question available"
      );
    } else {
      return (
        question.question_text ||
        question.question_text_gujarati ||
        "No question available"
      );
    }
  };

  const getOptionText = (
    question: Question,
    option: "A" | "B" | "C" | "D",
    selectedLanguage: "english" | "gujarati"
  ): string => {
    const optionLower = option.toLowerCase() as "a" | "b" | "c" | "d";
    const englishKey = `option_${optionLower}` as keyof Question;
    const gujaratiKey = `option_${optionLower}_gujarati` as keyof Question;

    if (selectedLanguage === "gujarati") {
      return (
        (question[gujaratiKey] as string) ||
        (question[englishKey] as string) ||
        question.options[option] ||
        `No option ${option}`
      );
    } else {
      return (
        (question[englishKey] as string) ||
        (question[gujaratiKey] as string) ||
        question.options[option] ||
        `No option ${option}`
      );
    }
  };

  const getLanguageIndicator = (
    question: Question
  ): "english" | "gujarati" | "both" => {
    const hasEnglish = question.question_text || question.option_a;
    const hasGujarati =
      question.question_text_gujarati || question.option_a_gujarati;

    if (hasEnglish && hasGujarati) return "both";
    if (hasGujarati) return "gujarati";
    return "english";
  };

  useEffect(() => {
    if (uuid) {
      fetchQuizQuestions();
    }
  }, [uuid, language]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeRemaining > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Show toast notification that time is up
            toast.error(
              "⏰ Time's up! Your test has been automatically submitted.",
              {
                duration: 4000,
                style: {
                  background: "#dc2626",
                  color: "white",
                  fontWeight: "bold",
                },
              }
            );
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining, showResults]);

  // Handle browser navigation (back button, close tab, refresh) during quiz
  useEffect(() => {
    // Only block navigation if quiz is started and not finished
    if (!quizStarted || showResults) {
      return;
    }

    // Handle browser back/forward buttons and page close/refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to close the test? Your progress will be lost.";
      return e.returnValue;
    };

    // Handle React Router navigation (back button within app)
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      // Show custom confirmation dialog
      setShowExitConfirmation(true);
      // Push current state back to prevent immediate navigation
      window.history.pushState(null, "", window.location.href);
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Push initial state to enable popstate detection
    window.history.pushState(null, "", window.location.href);

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [quizStarted, showResults]);

  const fetchQuizQuestions = async () => {
    try {
      // First try to get questions directly from category (existing logic)
      let response;
      try {
        response = await api.get(`/dynamic/categories/${uuid}/questions`, {
          params: {
            language: language,
            shuffle: false, // Changed to false to maintain Excel order
          },
        });

        if (response.data.success) {
          setQuizData(response.data.data);
          // Use category-level test duration (in minutes) or fallback to 1.5 minutes per question
          const testDurationMinutes =
            response.data.data.category?.test_duration_minutes ||
            response.data.data.questions.length * 1.5;
          setTimeRemaining(testDurationMinutes * 60); // Convert minutes to seconds
          return;
        }
      } catch (categoryError: any) {
        console.log("Category endpoint failed, trying test series approach...");

        // If category approach fails, try test series approach (for free tests)
        try {
          // Get test series details first
          const seriesResponse = await api.get(`/dynamic/test-series/${uuid}`);

          if (seriesResponse.data.success) {
            const testSeries = seriesResponse.data.data;

            if (!testSeries.categories || testSeries.categories.length === 0) {
              toast.error("This test has no questions available yet.");
              setIsLoading(false);
              return;
            }

            // Find the first category that has questions
            let questionsFound = false;
            for (const category of testSeries.categories) {
              if (
                category.has_questions ||
                category.total_questions_recursive > 0
              ) {
                try {
                  const questionsResponse = await api.get(
                    `/dynamic/categories/${category.uuid}/questions`,
                    {
                      params: {
                        language: language,
                        shuffle: false, // Changed to false to maintain Excel order
                      },
                    }
                  );

                  if (
                    questionsResponse.data.success &&
                    questionsResponse.data.data.questions.length > 0
                  ) {
                    setQuizData(questionsResponse.data.data);
                    // Use category-level test duration or fallback to 1.5 minutes per question
                    const testDurationMinutes =
                      questionsResponse.data.data.category
                        ?.test_duration_minutes ||
                      questionsResponse.data.data.questions.length * 1.5;
                    setTimeRemaining(testDurationMinutes * 60); // Convert minutes to seconds
                    questionsFound = true;
                    break;
                  }
                } catch (err) {
                  continue; // Try next category
                }
              }
            }

            if (!questionsFound) {
              toast.error("No questions found in this test series.");
              setIsLoading(false);
              return;
            }
          }
        } catch (seriesError: any) {
          // If both approaches fail, show the original error
          throw categoryError;
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch quiz questions:", error);

      // Handle authentication errors
      if (error?.response?.status === 401) {
        console.log("❌ 401 Authentication error - redirecting to login");
        toast.error("Authentication required. Please log in again.");
        window.location.href = "/login";
        return;
      }

      // Handle access denied errors
      if (error?.response?.status === 403) {
        console.log("❌ 403 Access denied error");
        toast.error("Access denied. This quiz requires a subscription.");
        return;
      }

      toast.error("Failed to load quiz questions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkForReview = () => {
    setMarkedQuestions((prev) => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex],
    }));
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResults) return;

    // If the same option is clicked again, deselect it (toggle behavior)
    if (selectedAnswers[currentQuestionIndex] === answer) {
      const newAnswers = { ...selectedAnswers };
      delete newAnswers[currentQuestionIndex];
      setSelectedAnswers(newAnswers);
      toast.success("Answer deselected", {
        duration: 1500,
        style: {
          background: "#6366f1",
          color: "white",
        },
      });
    } else {
      // Select the new answer
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestionIndex]: answer,
      });
    }
  };

  const handleNextQuestion = () => {
    if (!quizData) return;

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Show confirmation modal before submitting
      setShowSubmitConfirmation(true);
    }
  };

  const handleReviewAndSubmit = () => {
    // Always show confirmation dialog first
    setShowSubmitConfirmation(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitConfirmation(false);
    // Check if there are marked questions for review
    if (
      Object.values(markedQuestions).filter((value) => value === true).length
    ) {
      setShowReviewModal(true);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // State to store backend-calculated results
  const [backendResults, setBackendResults] = useState<{
    score: number;
    percentage: number;
    finalScore: number;
    negativeMarkingEnabled: boolean;
    negativeMarks: number;
  } | null>(null);

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      // Prepare answers for attempted questions
      const attemptedAnswers = Object.entries(selectedAnswers).map(
        ([questionIndex, selectedOption]) => ({
          questionId: quizData?.questions[parseInt(questionIndex)]?.id,
          selectedOption: selectedOption,
          isCorrect:
            selectedOption ===
            quizData?.questions[parseInt(questionIndex)]?.correct_answer,
          timeSpent: 60, // Default time per question
          markedForReview: markedQuestions[parseInt(questionIndex)] === true, // Add marked status
        })
      );

      // Prepare entries for NOT attempted questions
      const notAttemptedAnswers = quizData?.questions
        .map((question, index) => {
          // If question was not answered
          if (!selectedAnswers[index]) {
            return {
              questionId: question.id,
              selectedOption: null, // NULL means not attempted
              isCorrect: false,
              timeSpent: 0,
              markedForReview: markedQuestions[index] === true,
            };
          }
          return null;
        })
        .filter((answer) => answer !== null) || [];

      // Combine all answers (attempted + not attempted)
      const answers = [...attemptedAnswers, ...notAttemptedAnswers];

      const totalTimeSpent = Math.max(
        0,
        (((quizData?.category?.test_duration_minutes || 60) * 60) - timeRemaining)
      )
      // Use the simple quiz submission API
      const submitResponse = await api.post(`/quiz/submit`, {
        userId: sessionStorage.getItem("planprep4u_user")
          ? JSON.parse(sessionStorage.getItem("planprep4u_user")!).uuid
          : `quiz-user-${Date.now()}`,
        testSeriesId: uuid, // Treat uuid as test series ID (to match leaderboard expectation)
        answers: answers,
        totalQuestions: quizData?.questions.length || 0, // IMPORTANT: Send actual total for correct calculation
        totalTimeSpent: totalTimeSpent,
      });

      console.log("Quiz submission response:", submitResponse.data);

      if (submitResponse.data.success) {
        // Store backend-calculated results
        const data = submitResponse.data.data;
        setBackendResults({
          score: data.correctAnswers,
          percentage: data.percentage,
          finalScore: data.finalScore || data.score,
          negativeMarkingEnabled: data.negativeMarkingEnabled || false,
          negativeMarks: data.negativeMarksDeducted || 0,
          totalTimeSpent: totalTimeSpent,
          sessionId: data?.sessionId

        });

        try {
          const leaderboardResponse = await api.get(`/leaderboard/test-series/${data?.sessionId}`);

          if (leaderboardResponse.data.success) {
            const dataLeaderboard = leaderboardResponse?.data?.data;
            const userUuid = leaderboardResponse?.data?.metadata?.currentUserData?.uuid || JSON.parse(sessionStorage.getItem("planprep4u_user") || "{}").uuid;
            const myRank = dataLeaderboard.find(
              (item) =>
                item.userId === userUuid
            );

            setBackendResults(prev => ({
              ...prev,
              myRank: myRank?.rank,
              totalParticipants: leaderboardResponse?.data?.metadata?.total,
            }));

          }
        } catch (error) {

        }

        console.log("✅ Using backend-calculated results:", {
          percentage: data.percentage,
          finalScore: data.finalScore,
          negativeMarking: data.negativeMarkingEnabled,
        });

        toast.success("Quiz submitted successfully!");
        // Only show results if API call succeeds
        setShowResults(true);
        setQuizStarted(false);
      } else {
        console.error("Quiz submission failed:", submitResponse.data.message);
        toast.error("Failed to submit quiz. Please try again.");
        return; // Don't show results if submission fails
      }
    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      toast.error(
        "Failed to submit quiz. Please check your connection and try again."
      );
      return; // Don't show results if submission fails
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateScore = () => {
    if (!quizData) return { score: 0, percentage: 0 };

    let correctCount = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctCount++;
      }
    });

    const percentage = Math.round(
      (correctCount / quizData.questions.length) * 100
    );
    return { score: correctCount, percentage };
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const startQuiz = () => {
    // Check if negative marking is enabled
    if (quizData?.category?.negative_marking_enabled) {
      // Show warning popup first
      setShowNegativeMarkingWarning(true);
    } else {
      // No negative marking, start immediately
      setQuizStarted(true);
    }
  };

  const handleConfirmStartQuiz = () => {
    setShowNegativeMarkingWarning(false);
    setQuizStarted(true);
  };

  const handleCancelStartQuiz = () => {
    setShowNegativeMarkingWarning(false);
    // User can review the pre-quiz screen again
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);

    // User confirmed exit - navigate back
    navigate(-2);
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
    // User wants to stay on the test
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">No quiz questions found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  // Use backend results if available, otherwise fallback to local calculation
  const getDisplayResults = () => {
    if (showResults && backendResults) {
      return {
        score: backendResults.score,
        percentage: backendResults.percentage,
        finalScore: backendResults.finalScore,
      };
    }
    return showResults
      ? calculateScore()
      : { score: 0, percentage: 0, finalScore: 0 };
  };

  const { score, percentage, finalScore } = getDisplayResults();

  // Negative Marking Warning Modal
  const NegativeMarkingWarningModal = () => {
    if (!showNegativeMarkingWarning) return null;

    const negativeMarks = quizData?.category?.negative_marks_per_wrong || 0.25;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
          {/* Warning Icon */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="h-7 w-7 sm:h-10 sm:w-10 text-amber-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 text-center mb-2 sm:mb-3">
            Negative Marking Enabled!
          </h2>

          {/* Warning Message */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
            <p className="text-amber-800 font-medium mb-2 text-sm sm:text-base">
              ⚠️ This test has negative marking
            </p>
            <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
              For each <strong>wrong answer</strong>, you will lose{" "}
              <strong className="text-amber-900">{negativeMarks} marks</strong>.
            </p>
            <p className="text-amber-700 text-xs sm:text-sm mt-2">
              • Correct answer:{" "}
              <span className="text-green-600 font-semibold">+1 mark</span>
              <br />• Wrong answer:{" "}
              <span className="text-red-600 font-semibold">
                -{negativeMarks} marks
              </span>
              <br />• Unanswered:{" "}
              <span className="text-gray-600 font-semibold">No penalty</span>
            </p>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 mb-4 sm:mb-6">
            <p className="text-blue-900 font-medium text-xs sm:text-sm mb-1">
              💡 Tips:
            </p>
            <ul className="text-blue-800 text-xs space-y-1 list-disc list-inside">
              <li>Answer only if you're confident</li>
              <li>Skip questions if unsure</li>
              <li>Review your answers before submitting</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleCancelStartQuiz}
              className="flex-1 px-4 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmStartQuiz}
              className="flex-1 px-4 py-2.5 sm:py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-md text-sm sm:text-base"
            >
              <span className="hidden sm:inline">I Understand, Start Test</span>
              <span className="sm:hidden">Start Test</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Pre-quiz screen
  if (!quizStarted && !showResults) {
    return (
      <>
        {/* Negative Marking Warning Modal */}
        <NegativeMarkingWarningModal />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="flex items-center mb-4 sm:mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 mr-2 sm:mr-3"
            >
              <ArrowLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            </button>
            <h1 className="text-base sm:text-xl font-semibold text-gray-900">
              Quiz Ready
            </h1>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 break-words">
              {quizData.category.name}
            </h2>

            {quizData.category.description && (
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: quizData.category.description }}>

              </p>
            )}

            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {quizData.questions.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Questions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Time Limit
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="mb-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3 text-center">
                Choose Language / ભાષા પસંદ કરો
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                <button
                  onClick={() => setLanguage("gujarati")}
                  className={`flex-1 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${language === "gujarati"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  ગુજરાતી (Gujarati)
                </button>
                <button
                  onClick={() => setLanguage("english")}
                  className={`flex-1 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${language === "english"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Negative Marking Indicator */}
            {quizData.category.negative_marking_enabled && (
              <div className="mb-4 sm:mb-6 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center mx-auto max-w-sm">
                <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="text-amber-800 font-medium text-xs sm:text-sm">
                  Negative marking enabled (-
                  {quizData.category.negative_marks_per_wrong || 0.25} per wrong
                  answer)
                </span>
              </div>
            )}

            <button
              onClick={startQuiz}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </>
    );
  }

  // Results screen
  if (showResults) {
    // Calculate detailed statistics
    const totalQuestions = quizData.questions.length;
    const answeredQuestions = Object.keys(selectedAnswers).length;
    const correctAnswers = backendResults?.correctAnswers ?? score;
    // Wrong answers = attempted - correct (NOT defaulting to 0!)
    const wrongAnswers =
      backendResults?.wrongAnswers ?? answeredQuestions - correctAnswers;
    const notAttempted = totalQuestions - answeredQuestions;

    // Marks calculation - use backend data if available, otherwise calculate from questions
    // Backend returns: totalMarks, obtainedMarks (before negative), negativeMarksDeducted, finalScore (after negative)
    const totalMarks =
      backendResults?.totalMarks ??
      quizData.questions.reduce((sum, q) => sum + (q.marks || 1), 0);

    // Calculate attempted marks (sum of marks for attempted questions only)
    let attemptedMarks = 0;
    Object.keys(selectedAnswers).forEach((index) => {
      const question = quizData.questions[parseInt(index)];
      attemptedMarks += question?.marks || 1;
    });

    const obtainedMarksBeforeNegative =
      backendResults?.obtainedMarks ?? correctAnswers;
    const negativeMarks = backendResults?.negativeMarksDeducted ?? 0;
    const obtainedMarks = backendResults?.finalScore ?? correctAnswers; // Final score after negative marking

    // Accuracy = (correct answers / attempted questions) × 100
    // Use backend percentage if available, otherwise calculate
    const accuracy =
      backendResults?.percentage ??
      (answeredQuestions > 0
        ? Math.round((correctAnswers / answeredQuestions) * 100)
        : 0);

    console.log("📊 Frontend Quiz Results Display:", {
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      wrongAnswers,
      notAttempted,
      accuracy: accuracy + "%",
      finalScore: obtainedMarks,
      backendData: backendResults,
      formula: `Accuracy = ${correctAnswers}/${answeredQuestions} × 100 = ${accuracy}%`,
    });

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Quiz Results
          </h1>
          <p className="text-sm sm:text-base text-gray-600 break-words px-4">
            {quizData.category.name}
          </p>
        </div>

        {/* Main Results Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-8 mb-6 sm:mb-8">
          {/* Score Percentage */}
          <div className="text-center mb-6">
            <div className="text-4xl sm:text-6xl font-bold mb-2">
              <span
                className={
                  percentage >= 70
                    ? "text-green-600"
                    : percentage >= 50
                      ? "text-yellow-600"
                      : "text-red-600"
                }
              >
                {percentage}%
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              {percentage >= 70
                ? "Excellent work!"
                : percentage >= 50
                  ? "Good effort!"
                  : "Keep practicing!"}
            </p>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-4">
            {/* Rank */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-yellow-700">
                {backendResults?.myRank ?? 1}/{backendResults?.totalParticipants ?? 1}
              </div>
              <div className="text-xs sm:text-sm text-yellow-600 font-medium">
                Rank
              </div>
            </div>
            {/* percentile */}
            <div className="bg-lime-50 border border-lime-200 rounded-lg p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-lime-700">
                {backendResults?.myRank && backendResults?.totalParticipants
                  ? (
                    (((backendResults?.totalParticipants - backendResults?.myRank + 1) / backendResults?.totalParticipants) * 100)) || 0 : 0}
              </div>
              <div className="text-xs sm:text-sm text-lime-600 font-medium">
                My Percentile
              </div>
            </div>

            {/* Time Taken */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-700">
                {formatTime(backendResults?.totalTimeSpent)}
              </div>
              <div className="text-xs sm:text-sm text-orange-600 font-medium">
                Time Taken
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-4">
            {/* Total Questions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-700">
                {totalQuestions}
              </div>
              <div className="text-xs sm:text-sm text-blue-600 font-medium">
                Total Questions
              </div>
            </div>

            {/* Attempted */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-700">
                {answeredQuestions}
              </div>
              <div className="text-xs sm:text-sm text-purple-600 font-medium">
                Attempted
              </div>
            </div>
          </div>

          {/* Detailed Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Correct */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">
                {correctAnswers}
              </div>
              <div className="text-xs sm:text-sm text-green-600 font-medium">
                Correct
              </div>
            </div>

            {/* Wrong */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <XCircleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700">
                {wrongAnswers}
              </div>
              <div className="text-xs sm:text-sm text-red-600 font-medium">
                Wrong
              </div>
            </div>

            {/* Not Attempted */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <ClockIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-700">
                {notAttempted}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                Not Attempted
              </div>
            </div>
          </div>

          {/* Marks & Accuracy Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Marks Breakdown */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Marks:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {totalMarks}
                  </span>
                </div>
                {negativeMarks > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">
                        Marks Obtained:
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {obtainedMarksBeforeNegative}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-amber-600">
                        Negative Marks:
                      </span>
                      <span className="text-sm font-semibold text-amber-600">
                        -{negativeMarks}
                      </span>
                    </div>
                    <div className="h-px bg-gray-300 my-2"></div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Final Score:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    {obtainedMarks}
                  </span>
                </div>
              </div>

              {/* Accuracy */}
              <div className="flex flex-col items-center justify-center border-l-0 sm:border-l-2 border-blue-300 pl-0 sm:pl-4 mt-4 sm:mt-0">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                  {accuracy}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  Accuracy
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {obtainedMarks}/{attemptedMarks} marks
                </div>
                <div className="text-xs text-gray-400">
                  from {answeredQuestions} attempted
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <button
              onClick={() => {
                // Navigate to solutions page
                navigate(`/tests/solutions/${uuid}${backendResults?.sessionId ? `?session=${backendResults.sessionId}` : ''}`, {
                  state: {
                    categoryName: quizData.category.name,
                    userAnswers: selectedAnswers,
                    markedQuestions: markedQuestions, // Pass marked questions data
                    score,
                    percentage,
                    language: language,
                  },
                });
              }}
              className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base font-medium"
            >
              View Solutions
            </button>
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setSelectedAnswers({});
                // Use category-level test duration for retake
                const testDurationMinutes =
                  quizData.category?.test_duration_minutes ||
                  quizData.questions.length * 1.5;
                setTimeRemaining(testDurationMinutes * 60);
              }}
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base font-medium"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => {
                // Navigate to leaderboard for this category
                navigate(`/tests/leaderboard/${backendResults?.sessionId || uuid}`, {
                  state: {
                    categoryName: quizData.category.name,
                    userScore: score,
                    totalQuestions: quizData.questions.length,
                  },
                });
              }}
              className="px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm sm:text-base font-medium"
            >
              Leaderboard
            </button>
          </div>
        </div>

        {/* Answer Review */}
        {/* <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Answer Review
          </h3>
          <div className="space-y-4">
            {quizData.questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correct_answer;

              return (
                <div
                  key={question.uuid}
                  className="border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {isCorrect ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">
                        {index + 1}. {getQuestionText(question, language)}
                      </p>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="text-gray-600">Your answer:</span>{" "}
                          <span
                            className={
                              isCorrect ? "text-green-600" : "text-red-600"
                            }
                          >
                            {userAnswer
                              ? `${userAnswer} - ${getOptionText(question, userAnswer as "A" | "B" | "C" | "D", language)}`
                              : "Not answered"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p>
                            <span className="text-gray-600">
                              Correct answer:
                            </span>{" "}
                            <span className="text-green-600">
                              {question.correct_answer} - {getOptionText(question, question.correct_answer as "A" | "B" | "C" | "D", language)}
                            </span>
                          </p>
                        )}
                        {(question.explanation || question.explanation_gujarati) && (
                          <p className="text-gray-600 italic">
                            {language === 'gujarati'
                              ? (question.explanation_gujarati || question.explanation)
                              : (question.explanation || question.explanation_gujarati)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div> */}
      </div>
    );
  }

  // Quiz interface
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          {/* Top Row - Title and Back Button */}
          <div className="flex items-start sm:items-center mb-3">
            <button
              onClick={() => {
                if (quizStarted && !showResults) {
                  setShowExitConfirmation(true);
                } else {
                  navigate(-1);
                }
              }}
              className="p-2 rounded-lg hover:bg-gray-100 mr-2 sm:mr-3 flex-shrink-0"
            >
              <ArrowLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-xl font-semibold text-gray-900 break-words line-clamp-2">
                {quizData.category.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Question {currentQuestionIndex + 1} of{" "}
                {quizData.questions.length}
              </p>
            </div>
          </div>

          {/* Bottom Row - Timer, Navigator, and Submit */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between sm:justify-end gap-2 sm:gap-4">
            <div className="flex items-center justify-center sm:justify-start text-sm text-gray-600 py-2 sm:py-0">
              <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span
                className={
                  timeRemaining < 300 ? "text-red-600 font-medium" : ""
                }
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowNavigator(true)}
                className="flex-1 sm:flex-none p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                title="Question Navigator"
              >
                <Squares2X2Icon className="h-5 w-5 mx-auto" />
              </button>
              <button
                onClick={handleReviewAndSubmit}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gray-200 rounded-full h-1.5 sm:h-2">
            <div
              className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100
                  }%`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
          >
            Previous
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleMarkForReview}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 rounded-lg border font-medium transition-colors text-xs sm:text-base ${markedQuestions[currentQuestionIndex]
                ? "bg-yellow-100 border-yellow-400 text-yellow-700 hover:bg-yellow-200"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              <span className="hidden sm:inline">
                {markedQuestions[currentQuestionIndex]
                  ? "Marked As Review"
                  : "Mark As Review"}
              </span>
              <span className="sm:hidden">
                {markedQuestions[currentQuestionIndex]
                  ? "Marked"
                  : "Mark Review"}
              </span>
            </button>
            <button
              onClick={handleNextQuestion}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base font-medium"
            >
              {currentQuestionIndex === quizData.questions.length - 1
                ? "Submit"
                : "Next"}
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 lg:p-8 mb-6">
          <div className="mb-4 sm:mb-6">
            <div className="flex items-start justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                <HTMLContent
                  content={formatTextWithLineBreaks(
                    getQuestionText(currentQuestion, language)
                  )}
                  className="text-sm sm:text-base lg:text-lg font-medium text-gray-900"
                />
              </div>
              {/* Language indicator - hidden on mobile */}
              <span
                className={`hidden sm:inline-flex flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full ${getLanguageIndicator(currentQuestion) === "both"
                  ? "bg-purple-100 text-purple-800"
                  : getLanguageIndicator(currentQuestion) === "gujarati"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-blue-100 text-blue-800"
                  }`}
              >
                {getLanguageIndicator(currentQuestion) === "both"
                  ? "Both"
                  : getLanguageIndicator(currentQuestion) === "gujarati"
                    ? "Gujarati"
                    : "English"}
              </span>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {["A", "B", "C", "D"].map((option) => {
              const optionText = getOptionText(
                currentQuestion,
                option as "A" | "B" | "C" | "D",
                language
              );
              const isSelected =
                selectedAnswers[currentQuestionIndex] === option;

              return (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full text-left p-2.5 sm:p-3 lg:p-4 rounded-lg border transition-all ${isSelected
                    ? "border-gray-800 bg-gray-100 text-gray-900"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span
                      className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium flex-shrink-0 ${isSelected
                        ? "border-gray-800 bg-gray-800 text-white"
                        : "border-gray-300 text-gray-600"
                        }`}
                    >
                      {option}
                    </span>
                    <div className="flex-1 min-w-0">
                      <HTMLContent
                        content={formatTextWithLineBreaks(optionText)}
                        className="text-xs sm:text-sm lg:text-base"
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        {/* <div className="flex items-center justify-center">
          <div className="flex space-x-2">
            {quizData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded text-sm font-medium ${
                  index === currentQuestionIndex
                    ? "bg-blue-600 text-white"
                    : selectedAnswers[index]
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-gray-100 text-gray-600 border border-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div> */}

        {/* Question Navigator Modal */}
        {showNavigator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Question Navigator
                </h3>
                <button
                  onClick={() => setShowNavigator(false)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6">
                {/* Question Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3 mb-6 sm:mb-8">
                  {quizData.questions.map((question, index) => {
                    const isCurrentQuestion = index === currentQuestionIndex;
                    const isAnswered = selectedAnswers.hasOwnProperty(index);
                    const isMarkedForReview = markedQuestions[index] === true;

                    // Determine question status (priority order)
                    let statusClass = "";
                    let statusText = "";

                    if (isCurrentQuestion) {
                      statusClass =
                        "border-blue-500 border-3 bg-blue-100 text-blue-800 ring-2 ring-blue-200";
                      statusText = "Current Question";
                    } else if (isMarkedForReview) {
                      // Marked for review - orange/yellow color
                      statusClass =
                        "bg-amber-50 text-amber-700 border-2 border-amber-400 hover:bg-amber-100";
                      statusText = isAnswered
                        ? "Marked for Review (Answered)"
                        : "Marked for Review";
                    } else if (isAnswered) {
                      statusClass =
                        "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100";
                      statusText = "Answered";
                    } else {
                      statusClass =
                        "bg-gray-50 text-gray-500 border-2 border-gray-200 hover:bg-gray-100";
                      statusText = "Not Answered";
                    }

                    return (
                      <button
                        key={question.id}
                        onClick={() => {
                          setCurrentQuestionIndex(index);
                          setShowNavigator(false);
                        }}
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold transition-all hover:scale-110 transform ${statusClass}`}
                        title={`Question ${index + 1} - ${statusText}`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mb-6 sm:mb-8">
                  <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
                    Language:
                  </h4>
                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as "english" | "gujarati")
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                  >
                    <option value="english">English</option>
                    <option value="gujarati">Gujarati</option>
                  </select>
                </div>

                {/* Legend */}
                <div className="mb-6 sm:mb-8">
                  <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
                    Legend:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-5 h-5 rounded-lg bg-blue-100 border-2 border-blue-500 ring-1 ring-blue-200 flex-shrink-0"></div>
                      <span className="text-gray-700">Current</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-5 h-5 rounded-lg bg-amber-50 border-2 border-amber-400 flex-shrink-0"></div>
                      <span className="text-gray-700">Marked Review</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-5 h-5 rounded-lg bg-green-50 border-2 border-green-200 flex-shrink-0"></div>
                      <span className="text-gray-700">Answered</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-5 h-5 rounded-lg bg-gray-50 border-2 border-gray-200 flex-shrink-0"></div>
                      <span className="text-gray-700">Not Answered</span>
                    </div>
                  </div>
                </div>

                {/* Progress Statistics */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                  <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
                    Quiz Progress
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        {quizData.questions.length}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Total
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">
                        {Object.keys(selectedAnswers).length}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Answered
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-amber-600">
                        {
                          Object.values(markedQuestions).filter(
                            (val) => val === true
                          ).length
                        }
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Marked
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-orange-600">
                        {quizData.questions.length -
                          Object.keys(selectedAnswers).length}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Remaining
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-xl sm:text-2xl font-bold ${timeRemaining < 300 ? "text-red-600" : "text-blue-600"
                          }`}
                      >
                        {formatTime(timeRemaining)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Time Left
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                      <span>Completion</span>
                      <span>
                        {Math.round(
                          (Object.keys(selectedAnswers).length /
                            quizData.questions.length) *
                          100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${(Object.keys(selectedAnswers).length /
                            quizData.questions.length) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowNavigator(false)}
                      className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-medium rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors text-sm sm:text-base"
                    >
                      Continue Quiz
                    </button>
                    <button
                      onClick={() => {
                        handleSubmitQuiz();
                        setShowNavigator(false);
                      }}
                      className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white font-medium rounded-lg sm:rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                      disabled={
                        Object.keys(selectedAnswers).length === 0 ||
                        isSubmitting
                      }
                    >
                      {isSubmitting && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {isSubmitting
                        ? "Submitting..."
                        : `Submit Quiz (${Object.keys(selectedAnswers).length
                        }/${quizData.questions.length})`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exit Confirmation Modal */}
        {showExitConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
              {/* Warning Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Exit Test?
              </h3>

              {/* Message */}
              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to close the test? All your progress will
                be lost and cannot be recovered.
              </p>

              {/* Current Progress Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Questions Answered:
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {Object.keys(selectedAnswers).length} /{" "}
                    {quizData?.questions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time Remaining:</span>
                  <span className="text-sm font-bold text-blue-600">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelExit}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Continue Test
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="flex-1 px-4 py-3 border-2 border-red-300 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
                >
                  Exit Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {showSubmitConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              {/* Statistics Section */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ClockIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Time Left</span>
                  </div>
                  <span
                    className={`text-sm font-bold ${timeRemaining < 300 ? "text-red-600" : "text-blue-600"
                      }`}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Attempted</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {Object.keys(selectedAnswers).length}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <XCircleIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Unattempted</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {quizData.questions.length -
                      Object.keys(selectedAnswers).length}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <StarIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Marked</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {
                      Object.values(markedQuestions).filter(
                        (val) => val === true
                      ).length
                    }
                  </span>
                </div>
              </div>

              {/* Confirmation Text */}
              <p className="text-center text-gray-700 font-medium mb-6">
                Are you sure you want to submit the test?
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowSubmitConfirmation(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  No
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Review Your Answers</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {quizData.questions.map((q, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isMarked = markedQuestions[index];

                  if (!isMarked) return <></>;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentQuestionIndex(index); // jump to question
                        setShowReviewModal(false); // close modal
                      }}
                      className="w-full text-left border-b border-gray-200 pb-3 last:border-b-0 hover:bg-gray-50 rounded-lg px-2"
                    >
                      <p className="font-medium flex items-center justify-between">
                        <span>
                          {" "}
                          <span>{index + 1}.</span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: getQuestionText(q, language),
                            }}
                          ></span>
                        </span>
                        {isMarked && (
                          <span className="ml-2 text-yellow-600">(Marked)</span>
                        )}
                      </p>
                      <p className="text-sm">
                        Your Answer:{" "}
                        <span
                          className={
                            userAnswer === q.correct_answer
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {userAnswer
                            ? `${userAnswer} - ${q.options[userAnswer as keyof typeof q.options]
                            }`
                            : "Not Answered"}
                        </span>
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    handleSubmitQuiz();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeTestPage;
