
import React, { useState, useMemo } from 'react';
import { AppState, WorkoutRecord } from '../types';
import { MET_DATA, calculateCalories } from '../services/met_service';
import { Dumbbell, Clock, Flame, Save } from 'lucide-react';

interface WorkoutPlannerProps {
  state: AppState;
  onAddWorkout: (workout: WorkoutRecord) => void;
}

const WorkoutPlanner: React.FC<WorkoutPlannerProps> = ({ state, onAddWorkout }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState("유산소");
  const [exercise, setExercise] = useState(MET_DATA["유산소"][0].name);
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState<'낮음' | '보통' | '높음'>('보통');
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");

  const selectedMet = useMemo(() => {
    return MET_DATA[category].find(e => e.name === exercise)?.met || 3.0;
  }, [category, exercise]);

  const currentWeight = state.weightLogs[state.weightLogs.length - 1]?.weight || 70;
  const estimatedCalories = calculateCalories(selectedMet, currentWeight, duration);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWorkout: WorkoutRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date,
      category,
      type: exercise,
      intensity,
      duration,
      met: selectedMet,
      calories: estimatedCalories,
      completed: false,
      title: title || `${exercise} 운동`,
      memo
    };
    onAddWorkout(newWorkout);
    alert("운동 계획이 저장되었습니다!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Dumbbell className="text-emerald-500" />
          운동 플래너
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">운동 날짜</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">운동 제목</label>
              <input 
                type="text" 
                placeholder="예: 저녁 유산소 루틴"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-500">카테고리 선택</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(MET_DATA).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setCategory(cat); setExercise(MET_DATA[cat][0].name); }}
                  className={`px-6 py-2 rounded-full font-bold transition-all ${category === cat ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">상세 종목</label>
              <select 
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {MET_DATA[category].map(e => (
                  <option key={e.name} value={e.name}>{e.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">운동 강도</label>
              <div className="flex gap-2">
                {['낮음', '보통', '높음'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setIntensity(lvl as any)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${intensity === lvl ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">운동 시간 (분)</label>
              <div className="flex gap-2">
                {[30, 60, 90, 120].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDuration(m)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${duration === m ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {m}분
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-6 flex items-center justify-between border border-emerald-100">
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase">예상 소모 칼로리</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-emerald-700">{estimatedCalories}</span>
                  <span className="text-emerald-500 font-bold">kcal</span>
                </div>
              </div>
              <Flame className="text-emerald-500" size={40} />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Save /> 계획 저장하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkoutPlanner;
