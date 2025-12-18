
import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, icon, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default DashboardCard;
