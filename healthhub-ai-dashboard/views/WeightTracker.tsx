
import React, { useState } from 'react';
import { AppState, WeightRecord } from '../types';
import DashboardCard from '../components/DashboardCard';
import { Scale, History, TrendingUp, Info } from 'lucide-react';

interface WeightTrackerProps {
  state: AppState;
  onAddLog: (log: { date: string, weight: number }) => void;
}

const WeightTracker: React.FC<WeightTrackerProps> = ({ state, onAddLog }) => {
  const [newWeight, setNewWeight] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const handleAdd = () => {
    if (!newWeight) return;
    onAddLog({
      date,
      weight: parseFloat(newWeight)
    });
    setNewWeight('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
            <Scale size={24} />
          </div>
          체중 관리 기록
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 ml-1">날짜</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 ml-1">현재 체중 (kg)</label>
            <input 
              type="number" 
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="0.0"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold text-lg"
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleAdd}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              기록 저장
            </button>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-8 flex items-start gap-4">
          <Info className="text-blue-500 shrink-0 mt-1" size={20} />
          <p className="text-sm text-blue-700 leading-relaxed font-medium">
            체중은 매일 같은 시간(예: 기상 직후)에 측정하는 것이 가장 정확합니다. <br/>
            기록된 데이터는 AI가 분석하여 주간 건강 보고서에 반영됩니다.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
            <History size={14} /> 최근 체중 변화 내역
          </h3>
          <div className="space-y-3">
            {state.weightLogs.slice().reverse().map((log, i) => {
              const prev = state.weightLogs[state.weightLogs.length - 2 - i];
              const diff = prev ? log.weight - prev.weight : null;
              
              return (
                <div key={log.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-black shadow-sm border border-slate-100">
                      {log.date.split('-')[2]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-xl text-slate-800">{log.weight} kg</p>
                        <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase">BMI {log.bmi}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-bold">{log.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {diff !== null && (
                      <div className={`flex items-center gap-1 font-black text-sm ${diff > 0 ? 'text-rose-500' : diff < 0 ? 'text-blue-500' : 'text-slate-400'}`}>
                        {diff > 0 ? <TrendingUp size={14} /> : null}
                        {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} kg
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightTracker;
