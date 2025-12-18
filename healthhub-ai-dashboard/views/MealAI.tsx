
import React, { useState, useMemo, useEffect } from 'react';
import { AppState, HealthGoal } from '../types';
import { getDietRecommendation, DietRequest } from '../services/geminiService';
import { 
  Sparkles, Utensils, Zap, Loader2, RotateCw, Copy, CheckCircle, 
  User, Weight, Ruler, Activity, Apple, Info, X, ClipboardCheck,
  TrendingDown, ShieldPlus, Repeat, HeartPulse
} from 'lucide-react';

interface MealAIProps {
  state: AppState;
}

const MealAI: React.FC<MealAIProps> = ({ state }) => {
  // Form States
  const [age, setAge] = useState<number>(state.settings.age || 30);
  const [gender, setGender] = useState<string>(state.settings.gender || '남성');
  const [height, setHeight] = useState<number>(state.settings.height || 170);
  const [weight, setWeight] = useState<number>(state.weightLogs[state.weightLogs.length - 1]?.weight || 65);
  const [goal, setGoal] = useState<string>('체중 감량');
  const [mealTime, setMealTime] = useState<string>('전체');
  const [activityLevel, setActivityLevel] = useState<string>('가벼운 활동 (주 1-3회 운동)');
  const [allergies, setAllergies] = useState<string>('');
  const [preferences, setPreferences] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Result States
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Real-time Calorie Calculation (Mifflin-St Jeor)
  const targetKcal = useMemo(() => {
    let bmr = 0;
    if (gender === '남성' || gender === '남') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const factors: Record<string, number> = {
      '거의 활동 없음': 1.2,
      '가벼운 활동 (주 1-3회 운동)': 1.375,
      '보통 활동 (주 3-5회 운동)': 1.55,
      '매우 활발한 활동 (주 6-7회 운동)': 1.725
    };

    const factor = factors[activityLevel] || 1.2;
    let tdee = bmr * factor;

    if (goal === '체중 감량') tdee -= 500;
    if (goal === '근육 증가') tdee += 300;
    
    return Math.max(1200, Math.round(tdee));
  }, [age, gender, height, weight, activityLevel, goal]);

  const handleRecommend = async () => {
    setLoading(true);
    const req: DietRequest = {
      age, gender, height, weight, goal, mealTime, activityLevel, 
      allergies, preferences, notes, targetKcal
    };
    const res = await getDietRecommendation(req);
    setRecommendation(res);
    setLoading(false);
    setShowModal(true);
  };

  const copyToClipboard = () => {
    if (!recommendation) return;
    const text = `
[AI 맞춤 식단 추천]
목표: ${goal} (${targetKcal}kcal)
제목: ${recommendation.title}

아침: ${recommendation.breakfast}
점심: ${recommendation.lunch}
저녁: ${recommendation.dinner}
${recommendation.snack ? `간식: ${recommendation.snack}` : ''}

AI 조언: ${recommendation.tip}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dietGoals = [
    { label: '체중 감량', icon: <TrendingDown size={24} />, color: 'bg-indigo-500' },
    { label: '근육 증가', icon: <Zap size={24} />, color: 'bg-emerald-500' },
    { label: '체중 유지', icon: <Repeat size={24} />, color: 'bg-blue-500' },
    { label: '건강 관리', icon: <HeartPulse size={24} />, color: 'bg-rose-500' },
  ];

  const mealTimes = ['아침', '점심', '저녁', '간식', '전체'];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <h1 className="text-4xl font-black text-slate-800 text-center mb-10 tracking-tight">
        AI 맞춤 식단 추천 시스템
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Summary Card (Sticky) */}
        <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-8">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white text-center">
              <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">맞춤 식단</p>
              <p className="text-sm font-bold opacity-60 mb-6">{state.settings.name} 님 추천</p>
              
              <div className="relative inline-block mb-4">
                <div className="w-40 h-40 bg-white/20 rounded-full flex flex-col items-center justify-center backdrop-blur-sm border border-white/30">
                  <p className="text-4xl font-black">{targetKcal}</p>
                  <p className="text-xs font-bold opacity-80 uppercase">kcal 목표</p>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white text-indigo-600 p-2 rounded-xl shadow-lg">
                  <Zap size={20} fill="currentColor" />
                </div>
              </div>
            </div>

            <div className="p-8 space-y-4">
              {[
                { label: '성별', value: gender },
                { label: '나이', value: `${age}세` },
                { label: '키', value: `${height}cm` },
                { label: '체중', value: `${weight}kg` },
                { label: '목표', value: goal },
                { label: '식사 시간', value: mealTime },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold">{item.label}</span>
                  <span className="text-slate-800 font-black">{item.value}</span>
                </div>
              ))}

              <div className="mt-8 pt-6 border-t border-slate-50">
                <div className="bg-amber-50 rounded-2xl p-4 flex gap-3">
                  <Info className="text-amber-500 shrink-0" size={18} />
                  <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                    개인 정보가 정확해야 더 정교한 맞춤형 식단을 추천해드릴 수 있어요!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="flex-1 bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-slate-800 mb-2">AI 식단 추천</h2>
            <p className="text-slate-400 font-medium">개인 맞춤형 건강 식단을 추천받아보세요</p>
          </div>

          <div className="space-y-10">
            {/* Basic Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">나이</label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">성별</label>
                <select 
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 appearance-none"
                >
                  <option>남성</option>
                  <option>여성</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">키 (cm)</label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={e => setHeight(Number(e.target.value))}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">체중 (kg)</label>
                <input 
                  type="number" 
                  value={weight} 
                  onChange={e => setWeight(Number(e.target.value))}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
            </div>

            {/* Goal Section */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">식단 목표</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {dietGoals.map((g) => (
                  <button
                    key={g.label}
                    onClick={() => setGoal(g.label)}
                    className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all border-2 ${
                      goal === g.label 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 scale-[1.02] shadow-lg shadow-indigo-100' 
                      : 'border-slate-50 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:border-slate-100'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl mb-3 ${goal === g.label ? 'bg-indigo-500 text-white' : 'bg-white text-slate-300'}`}>
                      {g.icon}
                    </div>
                    <span className="font-black text-sm">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Time Selection */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">추천받을 식사</label>
              <div className="flex flex-wrap gap-2">
                {mealTimes.map(time => (
                  <button
                    key={time}
                    onClick={() => setMealTime(time)}
                    className={`flex-1 min-w-[80px] py-3 rounded-xl font-black text-sm transition-all ${
                      mealTime === time 
                      ? 'bg-indigo-500 text-white shadow-lg' 
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">활동 수준</label>
              <select 
                value={activityLevel}
                onChange={e => setActivityLevel(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option>거의 활동 없음</option>
                <option>가벼운 활동 (주 1-3회 운동)</option>
                <option>보통 활동 (주 3-5회 운동)</option>
                <option>매우 활발한 활동 (주 6-7회 운동)</option>
              </select>
            </div>

            {/* Exclusion / Preference / Notes */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">알레르기 / 제외하고 싶은 음식</label>
                <input 
                  type="text" 
                  placeholder="예: 견과류, 오이 등"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">선호하는 식사 스타일</label>
                <input 
                  type="text" 
                  placeholder="예: 간편한 한 그릇 요리, 샐러드 위주 등"
                  value={preferences}
                  onChange={e => setPreferences(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">추가 요청사항</label>
                <textarea 
                  rows={3}
                  placeholder="구체적인 상황이나 요청사항을 적어주세요 (예: 회사 근처 편의점에서 사 먹어야 해요)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 resize-none" 
                />
              </div>
            </div>

            <button 
              onClick={handleRecommend}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              AI 맞춤 식단 추천받기
            </button>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 text-white rounded-2xl">
                  <ClipboardCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{recommendation?.title || '추천 식단 결과'}</h3>
                  <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest">{goal} 플랜</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Meals */}
                <div className="lg:col-span-2 space-y-6">
                  {[
                    { title: '아침', content: recommendation?.breakfast, color: 'border-blue-200 bg-blue-50' },
                    { title: '점심', content: recommendation?.lunch, color: 'border-emerald-200 bg-emerald-50' },
                    { title: '저녁', content: recommendation?.dinner, color: 'border-orange-200 bg-orange-50' },
                    ...(recommendation?.snack ? [{ title: '간식', content: recommendation?.snack, color: 'border-purple-200 bg-purple-50' }] : [])
                  ].map((meal, idx) => (
                    <div key={idx} className={`p-6 rounded-[2rem] border-2 ${meal.color}`}>
                      <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                        {meal.title}
                      </h4>
                      <p className="text-slate-700 font-medium leading-relaxed">{meal.content}</p>
                    </div>
                  ))}
                </div>

                {/* Info Panel */}
                <div className="space-y-6">
                  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <Zap className="absolute -bottom-8 -right-8 text-white/10" size={140} />
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">총 권장 칼로리</p>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-black">{recommendation?.totalKcal || targetKcal}</span>
                        <span className="text-xs font-bold opacity-60">kcal</span>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">영양 성분 가이드</p>
                        <div className="space-y-2 text-xs font-bold">
                          <div className="flex justify-between">
                            <span className="opacity-60">탄수화물</span>
                            <span>{recommendation?.nutrition?.carbs || '적정량'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-60">단백질</span>
                            <span>{recommendation?.nutrition?.protein || '고단백'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-60">지방</span>
                            <span>{recommendation?.nutrition?.fat || '저지방'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-[2.5rem] p-8 border-2 border-indigo-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-3">AI 전문가 팁</p>
                    <p className="text-sm text-indigo-800 font-bold italic leading-relaxed">
                      "{recommendation?.tip}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-50 flex gap-4">
              <button 
                onClick={copyToClipboard}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all ${
                  copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                {copied ? '식단 복사됨!' : '식단 텍스트 복사'}
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealAI;
