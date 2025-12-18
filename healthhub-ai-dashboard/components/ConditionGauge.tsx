
import React from 'react';

interface ConditionGaugeProps {
  score: number;
}

const ConditionGauge: React.FC<ConditionGaugeProps> = ({ score }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = '#ef4444';
  let message = '관리 필요';
  
  if (score >= 80) {
    color = '#22c55e';
    message = '매우 좋음';
  } else if (score >= 50) {
    color = '#f59e0b';
    message = '보통';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="transparent"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-2xl font-bold">{score}</span>
        <span className="text-xs block text-slate-500">점</span>
      </div>
      <p className="mt-2 font-medium" style={{ color }}>{message}</p>
    </div>
  );
};

export default ConditionGauge;
