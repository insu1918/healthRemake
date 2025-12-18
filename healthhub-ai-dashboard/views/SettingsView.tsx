
import React, { useState } from 'react';
import { AppState, UserSettings, HealthGoal } from '../types';
import { User, Settings as SettingsIcon, Save } from 'lucide-react';

interface SettingsViewProps {
  state: AppState;
  onUpdateSettings: (settings: UserSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ state, onUpdateSettings }) => {
  const [formData, setFormData] = useState<UserSettings>(state.settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    alert("설정이 저장되었습니다.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <SettingsIcon className="text-slate-400" />
          개인 설정 및 목표
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={14} /> 기본 정보
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">사용자 이름</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">나이</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">성별</label>
                    <div className="flex gap-2">
                      {['남', '여'].map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData({...formData, gender: g as any})}
                          className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.gender === g ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                신체 수치 및 목표
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">키 (cm)</label>
                    <input 
                      type="number" 
                      value={formData.height}
                      onChange={e => setFormData({...formData, height: parseFloat(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">목표 체중 (kg)</label>
                    <input 
                      type="number" 
                      value={formData.targetWeight}
                      onChange={e => setFormData({...formData, targetWeight: parseFloat(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">관리 목표</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(HealthGoal).map(goal => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setFormData({...formData, goal})}
                        className={`py-3 rounded-xl text-xs font-bold transition-all ${formData.goal === goal ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Save size={20} /> 설정 변경 사항 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsView;
