import React from 'react';

interface AnalysisData {
  totalQuestions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  eSkipped: number;
  obtainedMarks: number;
  negativeMarks: number;
  finalScore: number;
  timeSpentSeconds: number;
  totalTimeAllowedSeconds: number;
}

interface Props {
  data: AnalysisData;
  className?: string;
}

function DonutChart({ segments }: { segments: { value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  const radius = 60;
  const stroke = 16;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((seg) => {
      const dash = (seg.value / total) * circumference;
      const arc = { dash, offset, color: seg.color };
      offset += dash;
      return arc;
    });

  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={arc.color}
          strokeWidth={stroke}
          strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
          strokeDashoffset={-arc.offset + circumference / 4}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={22} fontWeight="bold" fill="#111827">
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={11} fill="#6b7280">
        Questions
      </text>
    </svg>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

const TestAnalysisCharts: React.FC<Props> = ({ data, className = '' }) => {
  const {
    totalQuestions,
    correct,
    incorrect,
    unanswered,
    eSkipped,
    obtainedMarks,
    negativeMarks,
    finalScore,
    timeSpentSeconds,
    totalTimeAllowedSeconds,
  } = data;

  const timePercent = totalTimeAllowedSeconds > 0
    ? Math.min(100, Math.round((timeSpentSeconds / totalTimeAllowedSeconds) * 100))
    : 0;

  const scorePercent = (obtainedMarks + negativeMarks) > 0
    ? Math.max(0, Math.round((finalScore / (obtainedMarks + negativeMarks)) * 100))
    : 0;

  const segments = [
    { value: correct, color: '#16a34a', label: 'Correct', textColor: 'text-green-700', bg: 'bg-green-100' },
    { value: incorrect, color: '#dc2626', label: 'Incorrect', textColor: 'text-red-700', bg: 'bg-red-100' },
    { value: eSkipped, color: '#d97706', label: 'Skipped (E)', textColor: 'text-amber-700', bg: 'bg-amber-100' },
    { value: unanswered, color: '#9ca3af', label: 'Unattempted', textColor: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-6 ${className}`}>
      <h3 className="text-base font-semibold text-gray-900 mb-5">Detailed Analysis</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Donut Chart */}
        <div className="flex flex-col items-center justify-center">
          <DonutChart segments={segments.map((s) => ({ value: s.value, color: s.color }))} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-sm">
            {segments.map((s) => (
              <div key={s.label} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="text-gray-600">{s.label}</span>
                <span className={`font-semibold ${s.textColor}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Marks Breakdown */}
        <div className="flex flex-col justify-center space-y-4">
          <p className="text-sm font-medium text-gray-700">Marks Breakdown</p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Marks Earned</span>
                <span className="font-semibold text-green-700">+{obtainedMarks}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${totalQuestions > 0 ? Math.min(100, (correct / totalQuestions) * 100) : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Negative Marks</span>
                <span className="font-semibold text-red-700">-{negativeMarks}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 rounded-full"
                  style={{ width: `${totalQuestions > 0 ? Math.min(100, (incorrect / totalQuestions) * 100) : 0}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-800">Net Score</span>
                <span className={`text-lg font-bold ${finalScore >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {finalScore}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Stats */}
        <div className="flex flex-col justify-center space-y-4">
          <p className="text-sm font-medium text-gray-700">Time Analysis</p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Time Used</span>
                <span className="font-semibold text-gray-800">{formatTime(timeSpentSeconds)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${timePercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                of {formatTime(totalTimeAllowedSeconds)} allowed ({timePercent}%)
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg per question</span>
                <span className="font-semibold text-gray-800">
                  {totalQuestions > 0
                    ? formatTime(Math.round(timeSpentSeconds / totalQuestions))
                    : '—'}
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Accuracy</span>
                <span className="font-semibold text-primary-700">
                  {correct + incorrect > 0
                    ? Math.round((correct / (correct + incorrect)) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TestAnalysisCharts;
