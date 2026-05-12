import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export interface AnalysisData {
  totalQuestions: number;
  correct: number;
  incorrect: number;          // wrong A–D (does NOT include E or unanswered)
  unanswered: number;         // truly blank (penalised)
  eSkipped?: number;          // deliberate Option-E skips (no penalty)
  obtainedMarks: number;
  negativeMarks: number;
  finalScore: number;
  timeSpentSeconds: number;
  totalTimeAllowedSeconds?: number;
}

interface Props {
  data: AnalysisData;
  className?: string;
}

const formatMins = (seconds: number) => {
  if (!seconds || seconds < 0) return '0m';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
};

const COLORS = {
  correct: '#10b981',   // emerald-500
  incorrect: '#ef4444', // red-500
  unanswered: '#374151',// gray-700 (matches client mock "skipped" bar)
  eSkipped: '#f59e0b',  // amber-500
  used: '#f97316',      // orange-500 (time used slice)
  remaining: '#374151', // gray-700 (time remaining)
};

const TestAnalysisCharts: React.FC<Props> = ({ data, className = '' }) => {
  const eSkipped = data.eSkipped ?? 0;
  const total = Math.max(1, data.totalQuestions);
  const pctCorrect = Math.round((data.correct / total) * 100);
  const pctIncorrect = Math.round((data.incorrect / total) * 100);
  const pctUnanswered = Math.round((data.unanswered / total) * 100);
  const pctESkipped = Math.round((eSkipped / total) * 100);

  // Time analysis pie: spent vs remaining of allowed window. If no allowed
  // window is supplied, show spent-only as a full slice.
  const allowed = data.totalTimeAllowedSeconds ?? data.timeSpentSeconds;
  const remaining = Math.max(0, allowed - data.timeSpentSeconds);
  const timeData = [
    { name: 'Time Used', value: data.timeSpentSeconds, color: COLORS.used },
    { name: 'Time Remaining', value: remaining, color: COLORS.remaining },
  ];

  const scoreData = [
    { name: 'CORRECT',    Questions: data.correct,    fill: COLORS.correct },
    { name: 'INCORRECT',  Questions: data.incorrect,  fill: COLORS.incorrect },
    { name: 'SKIPPED (E)', Questions: eSkipped,       fill: COLORS.eSkipped },
    { name: 'UNANSWERED', Questions: data.unanswered, fill: COLORS.unanswered },
  ];

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 sm:p-6 ${className}`}>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">How did you perform?</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Analysis */}
        <div className="border border-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Time Analysis</h3>
            <div className="text-xs sm:text-sm text-gray-500">
              TOTAL TIME SPENT&nbsp;
              <span className="font-semibold text-gray-900">{formatMins(data.timeSpentSeconds)}</span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={timeData} dataKey="value" innerRadius={40} outerRadius={80} paddingAngle={2}>
                  {timeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatMins(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm text-gray-600 mt-2 space-y-0.5">
            <p><span className="text-green-600 font-semibold">{pctCorrect}%</span> on correct answers</p>
            <p><span className="text-red-600 font-semibold">{pctIncorrect}%</span> on incorrect answers</p>
            <p><span className="text-gray-700 font-semibold">{pctUnanswered}%</span> on skipped (unanswered)</p>
            {eSkipped > 0 && (
              <p><span className="text-amber-600 font-semibold">{pctESkipped}%</span> on Option-E skips (no penalty)</p>
            )}
          </div>
        </div>

        {/* Score Analysis */}
        <div className="border border-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Score Analysis</h3>
            <div className="text-xs sm:text-sm text-gray-500">
              TOTAL QUESTIONS&nbsp;
              <span className="font-semibold text-gray-900">{data.totalQuestions}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mb-2">ATTEMPTS</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={110} />
                <Tooltip />
                <Bar dataKey="Questions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-gray-700">
            You scored{' '}
            <span className="text-green-600 font-semibold">{data.obtainedMarks.toFixed(2)} marks</span>
            {' '}with correct attempts, lost{' '}
            <span className="text-red-600 font-semibold">{data.negativeMarks.toFixed(2)} marks</span>
            {' '}due to incorrect attempts and unattempted questions, and you marked{' '}
            <span className="text-amber-600 font-semibold">{eSkipped}</span> question(s) as Option E.
          </p>
        </div>
      </div>

      {/* Score summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 text-center">
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-xs text-gray-500">Final Score</div>
          <div className="text-base sm:text-lg font-semibold text-gray-900">{data.finalScore.toFixed(2)}</div>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3">
          <div className="text-xs text-emerald-700">Correct</div>
          <div className="text-base sm:text-lg font-semibold text-emerald-700">{data.correct}</div>
        </div>
        <div className="rounded-lg bg-red-50 p-3">
          <div className="text-xs text-red-700">Incorrect</div>
          <div className="text-base sm:text-lg font-semibold text-red-700">{data.incorrect}</div>
        </div>
        <div className="rounded-lg bg-gray-100 p-3">
          <div className="text-xs text-gray-700">Unanswered</div>
          <div className="text-base sm:text-lg font-semibold text-gray-900">{data.unanswered}</div>
        </div>
      </div>
    </div>
  );
};

export default TestAnalysisCharts;
