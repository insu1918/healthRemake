
import React, { useState } from 'react';
import { AppState, HealthMetrics } from '../types';
import DashboardCard from '../components/DashboardCard';
import { HeartPulse, Droplets, Moon, Save } from 'lucide-react';

interface HealthTrackerProps {
  state: AppState;
  onAddLog: (log: HealthMetrics) => void;
}

const HealthTracker: React.FC<HealthTrackerProps> = ({ state, onAddLog }) => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [sleepHours, setSleepHours] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!systolic || !diastolic || !bloodSugar || !sleepHours) return;

    onAddLog({
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      bloodSugar: parseInt(bloodSugar),
      sleepHours: parseFloat(sleepHours),
      date: new Date().toISOString().split('T')[0],
    });

    setSystolic('');
    setDiastolic('');
    setBloodSugar('');
    setSleepHours('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <HeartPulse className="text-rose-500" />
          건강 상태 기록
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
              <HeartPulse size={16} /> 혈압 (수축기/이완기)
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                placeholder="120"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 transition-all outline-none"
              />
              <span className="text-slate-300 font-bold">/</span>
              <input 
                type="number" 
                placeholder="80"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
              <Droplets size={16} /> 혈당 (mg/dL)
            </label>
            <input 
              type="number" 
              placeholder="100"
              value={bloodSugar}
              onChange={(e) => setBloodSugar(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
              <Moon size={16} /> 수면 시간 (시간)
            </label>
            <input 
              type="number" 
              step="0.5"
              placeholder="7.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>

          <div className="flex items-end">
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white rounded-xl py-3 font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              <Save size={18} /> 기록 저장하기
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="최근 혈압 기록">
          <div className="space-y-3">
            {state.healthLogs.slice(-5).reverse().map((log, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-xs font-bold text-slate-400">{log.date}</span>
                <span className="font-bold text-slate-700">{log.systolic}/{log.diastolic} mmHg</span>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="최근 혈당 기록">
          <div className="space-y-3">
            {state.healthLogs.slice(-5).reverse().map((log, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-xs font-bold text-slate-400">{log.date}</span>
                <span className="font-bold text-slate-700">{log.bloodSugar} mg/dL</span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default HealthTracker;
