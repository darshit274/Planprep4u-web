import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import TestAnalysisCharts from '../../components/tests/TestAnalysisCharts';
import type { AnalysisData } from '../../components/tests/TestAnalysisCharts';

// `id` here is the TestSession UUID. Navigated to as /tests/results/:id either
// directly from the post-submit screen or from an already-attempted card.
const TestResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState<AnalysisData | null>(null);
  const [meta, setMeta] = useState<{ testName: string; completedAt?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Retake context passed from TestSeriesDetailPage / CategoryDetailPage when
  // a user clicks an already-attempted test card. Lets us render the
  // "Already attempted" banner and a working Retake button.
  type RetakeCtx = {
    retakeCategoryUuid?: string;
    retakeCategoryName?: string;
    retakeSeriesUuid?: string;
    retakeSeriesName?: string;
    attempts?: number;
  };
  const retakeCtx = (location.state || {}) as Partial<AnalysisData> & { testName?: string } & RetakeCtx;

  useEffect(() => {
    if (!id) return;

    // Prefer in-memory state passed from TakeTestPage (no extra round trip),
    // fall back to /test-history/:sessionId.
    const stateData = (location.state || {}) as Partial<AnalysisData> & { testName?: string };
    if (stateData && typeof stateData.totalQuestions === 'number') {
      setData({
        totalQuestions: stateData.totalQuestions,
        correct: stateData.correct ?? 0,
        incorrect: stateData.incorrect ?? 0,
        unanswered: stateData.unanswered ?? 0,
        eSkipped: stateData.eSkipped ?? 0,
        obtainedMarks: stateData.obtainedMarks ?? 0,
        negativeMarks: stateData.negativeMarks ?? 0,
        finalScore: stateData.finalScore ?? 0,
        timeSpentSeconds: stateData.timeSpentSeconds ?? 0,
        totalTimeAllowedSeconds: stateData.totalTimeAllowedSeconds,
      });
      setMeta({ testName: stateData.testName || retakeCtx.retakeCategoryName || 'Test Results' });
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await api.get(`/test-history/${id}`);
        if (res.data?.success) {
          const d = res.data.data;
          setData({
            totalQuestions: d.totalQuestions || 0,
            correct: d.correct || 0,
            incorrect: d.wrong || 0,
            unanswered: d.notAttempted || 0,
            eSkipped: 0, // not currently tracked at session level (server change pending)
            obtainedMarks: d.obtainedMarks || 0,
            negativeMarks: d.negativeMarks || 0,
            finalScore: d.finalScore || 0,
            timeSpentSeconds: d.timeSpent || 0,
          });
          setMeta({
            testName: d.testName || retakeCtx.retakeCategoryName || 'Test Results',
            completedAt: d.completedAt,
          });
        } else {
          setError(res.data?.message || 'Failed to load result');
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load result');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.state]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
        </button>
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {error || 'No result data available.'}
        </div>
      </div>
    );
  }

  const handleRetake = () => {
    if (!retakeCtx.retakeCategoryUuid) return;
    navigate(`/tests/quiz/${retakeCtx.retakeCategoryUuid}`, {
      state: {
        categoryName: retakeCtx.retakeCategoryName,
        seriesName: retakeCtx.retakeSeriesName,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
      </button>

      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{meta?.testName || 'Test Results'}</h1>
        {meta?.completedAt && (
          <p className="text-sm text-gray-500 mt-1">
            Completed on {new Date(meta.completedAt).toLocaleString()}
          </p>
        )}
      </div>

      {/* Already-attempted banner — shown only when the user arrived here from
          an attempted-test card (TestSeriesDetailPage / CategoryDetailPage).
          Per client point #6. */}
      {retakeCtx.retakeCategoryUuid && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <CheckCircleIcon className="h-6 w-6 text-amber-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-900">Already attempted</p>
            <p className="text-sm text-amber-800">
              You've taken this test{retakeCtx.attempts ? ` ${retakeCtx.attempts} time(s)` : ''}. Below is
              your most recent analysis. You can retake the test to create a new attempt — it won't
              overwrite this one.
            </p>
          </div>
          <button
            onClick={handleRetake}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium whitespace-nowrap"
          >
            Retake test
          </button>
        </div>
      )}

      <TestAnalysisCharts data={data} />

      {id && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/test-history/${id}/solutions`)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
          >
            View Solutions
          </button>
          <button
            onClick={() => navigate('/test-history')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            All Test History
          </button>
        </div>
      )}
    </div>
  );
};

export default TestResultsPage;
