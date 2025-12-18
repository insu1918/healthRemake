
import React, { useMemo } from 'react';
import { AppState, BMIStatus } from '../types';
import DashboardCard from '../components/DashboardCard';
import ConditionGauge from '../components/ConditionGauge';
import { calculateBMI, calculateConditionScore, getBPStatus, getSugarStatus } from '../services/healthLogic';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Activity, Apple, Scale, HeartPulse, Droplets, Moon, CheckCircle2, AlertCircle } from 'lucide-react';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const today = new Date().toISOString().split('T')[0];
  const latestWeight = state.weightLogs[state.weightLogs.length - 1]?.weight || 0;
  const bmiInfo = calculateBMI(latestWeight, state.settings.height);
  const latestHealth = state.healthLogs[state.healthLogs.length - 1];
  const todayWorkout = state.workouts.find(w => w.date === today);
  
  const bpStatus = latestHealth ? getBPStatus(latestHealth.systolic, latestHealth.diastolic) : { label: '--', color: 'text-slate-300', level: 'normal' };
  const sugarStatus = latestHealth ? getSugarStatus(latestHealth.bloodSugar) : { label: '--', color: 'text-slate-300', level: 'normal' };

  const weightLoggedToday = state.weightLogs.some(l => l.date === today);
  const conditionScore = useMemo(() => {
    return calculateConditionScore(
      weightLoggedToday,
      todayWorkout?.completed || false,
      latestHealth?.sleepHours || 0,
      latestHealth
    );
  }, [state, todayWorkout, latestHealth, weightLoggedToday]);

  const bmiBadgeColor = {
    [BMIStatus.UNDERWEIGHT]: 'bg-blue-100 text-blue-700',
    [BMIStatus.NORMAL]: 'bg-emerald-100 text-emerald-700',
    [BMIStatus.OVERWEIGHT]: 'bg-amber-100 text-amber-700',
    [BMIStatus.OBESE]: 'bg-rose-100 text-rose-700',
  }[bmiInfo.status];

  const weightProgress = Math.min(100, Math.max(0, (Math.abs(latestWeight - state.settings.targetWeight) / 10) * 100));

  return (
    <div className="space-y-6 pb-10">
      {/* SECTION 1: Top Summary */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-slate-800">{state.settings.name} 님</h2>
            <span className="px-3 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">Lv.12</span>
          </div>
          <p className="text-slate-500 font-medium">관리 목표: <span className="text-blue-600 font-bold">{state.settings.goal}</span></p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-700">{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}</p>
          <p className="text-sm text-slate-400">AI 건강 도우미가 분석을 완료했습니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* SECTION 2: Weight & BMI */}
        <DashboardCard title="체중 & BMI 요약" icon={<Scale className="text-blue-500" size={20} />}>
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-800">{latestWeight}</span>
                <span className="text-slate-400 font-bold">kg</span>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${bmiBadgeColor}`}>
                {bmiInfo.status}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>목표 체중 ({state.settings.targetWeight}kg)</span>
                <span>남은 거리: {Math.abs(latestWeight - state.settings.targetWeight).toFixed(1)}kg</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-1000 ease-out" 
                  style={{ width: `${100 - weightProgress}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-400">현재 BMI 지수: <span className="font-bold text-slate-600">{bmiInfo.value}</span></p>
          </div>
        </DashboardCard>

        {/* SECTION 4: Today's Workout */}
        <DashboardCard title="오늘의 운동 상태" icon={<Activity className="text-emerald-500" size={20} />}>
          {todayWorkout ? (
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-2xl ${todayWorkout.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {todayWorkout.completed ? <CheckCircle2 size={32} /> : <Activity size={32} />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-black text-slate-800">{todayWorkout.type}</p>
                  {todayWorkout.completed && <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">완료</span>}
                </div>
                <p className="text-sm text-slate-500 font-medium">{todayWorkout.duration}분 / {todayWorkout.calories}kcal</p>
                <p className="text-xs text-slate-400">오후 7시 30분 운동 예정</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="text-slate-300" />
              </div>
              <p className="text-slate-400 text-sm font-medium">오늘 계획된 운동이 없습니다.</p>
              <button className="mt-2 text-blue-600 text-sm font-bold hover:underline">운동 플래너 가기</button>
            </div>
          )}
        </DashboardCard>

        {/* SECTION 7: Condition Score */}
        <DashboardCard title="컨디션 점수" icon={<HeartPulse className="text-rose-500" size={20} />}>
          <div className="flex flex-col items-center">
            <ConditionGauge score={conditionScore} />
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 3: Weight Trend Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">체중 변화 미니 그래프</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> 체중
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={state.weightLogs.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" hide />
                <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3b82f6" 
                  strokeWidth={5} 
                  dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 6: Health Stats Summary */}
        <DashboardCard title="건강 상태 요약" icon={<HeartPulse className="text-rose-500" size={20} />}>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-rose-500">
                  <HeartPulse size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">혈압 (BP)</p>
                  <p className="text-lg font-black text-slate-800">
                    {latestHealth ? `${latestHealth.systolic}/${latestHealth.diastolic}` : '--'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-black ${bpStatus.color}`}>{bpStatus.label}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-amber-500">
                  <Droplets size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">혈당 (GL)</p>
                  <p className="text-lg font-black text-slate-800">
                    {latestHealth ? latestHealth.bloodSugar : '--'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-black ${sugarStatus.color}`}>{sugarStatus.label}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-500">
                  <Moon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">수면 시간</p>
                  <p className="text-lg font-black text-slate-800">
                    {latestHealth ? `${latestHealth.sleepHours}h` : '--'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-indigo-500">{latestHealth?.sleepHours && latestHealth.sleepHours >= 7 ? '충분' : '부족'}</span>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* SECTION 5: AI Meal Summary */}
      <DashboardCard title="AI 식단 요약" icon={<Apple className="text-orange-500" size={20} />}>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
          <Apple className="absolute -bottom-4 -right-4 text-white/5" size={120} />
          <div className="relative z-10">
            <p className="text-orange-400 text-xs font-bold mb-3 uppercase tracking-wider">오늘의 추천 식단</p>
            <div className="flex divide-x divide-white/10 gap-4 mb-6">
              <div className="flex-1">
                <p className="text-[10px] opacity-60 font-bold">아침</p>
                <p className="text-sm font-medium line-clamp-1">오트밀 & 사과</p>
              </div>
              <div className="flex-1 pl-4">
                <p className="text-[10px] opacity-60 font-bold">점심</p>
                <p className="text-sm font-medium line-clamp-1">닭가슴살 샐러드</p>
              </div>
              <div className="flex-1 pl-4">
                <p className="text-[10px] opacity-60 font-bold">저녁</p>
                <p className="text-sm font-medium line-clamp-1">연어 구이</p>
              </div>
            </div>
            <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-slate-100 transition-colors shadow-lg">
              식단 다시 추천 받기
            </button>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Dashboard;
