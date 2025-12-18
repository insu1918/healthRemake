
import React, { useState, useEffect } from 'react';
import { AppState, HealthGoal, WeightRecord, WorkoutRecord, HealthMetrics, UserSettings, BMIStatus } from './types';
import { NAV_ITEMS } from './constants';
import Dashboard from './views/Dashboard';
import WeightTracker from './views/WeightTracker';
import MealAI from './views/MealAI';
import HealthTracker from './views/HealthTracker';
import WorkoutPlanner from './views/WorkoutPlanner';
import CalendarView from './views/CalendarView';
import SettingsView from './views/SettingsView';
import { Menu, X, Heart } from 'lucide-react';
import { calculateBMI } from './services/healthLogic';
import AuthView from './views/AuthView';
import { mapDBUserToSettings, DBUser, updateUser, addWeightRecord, addWorkoutRecord, addHealthMetric } from './services/api';

const INITIAL_STATE: AppState = {
  settings: {
    name: '로딩중...',
    email: 'loading@example.com',
    height: 175,
    targetWeight: 70,
    goal: HealthGoal.DIET,
    age: 28,
    gender: '남'
  },
  weightLogs: [],
  workouts: [],
  healthLogs: []
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Check for existing session
  useEffect(() => {
    const saved = localStorage.getItem('health_hub_state_v3');
    const savedLogin = localStorage.getItem('health_hub_is_logged_in');
    const savedUserId = localStorage.getItem('health_hub_user_id');

    if (saved && savedLogin === 'true') {
      setState(JSON.parse(saved));
      setIsLoggedIn(true);
      if (savedUserId) setCurrentUserId(Number(savedUserId));
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('health_hub_state_v3', JSON.stringify(state));
      localStorage.setItem('health_hub_is_logged_in', 'true');
      if (currentUserId) localStorage.setItem('health_hub_user_id', String(currentUserId));
    }
  }, [state, isLoggedIn, currentUserId]);

  const handleLoginSuccess = (dbUser: DBUser) => {
    setState(prev => ({
      ...prev,
      settings: mapDBUserToSettings(dbUser),
      weightLogs: [],
      workouts: [],
      healthLogs: []
    }));
    setIsLoggedIn(true);
    setCurrentUserId(dbUser.id);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUserId(null);
    localStorage.removeItem('health_hub_is_logged_in');
    localStorage.removeItem('health_hub_user_id');
    setState(INITIAL_STATE);
  };

  const handleAddWeightLog = async (log: { date: string, weight: number }) => {
    if (!currentUserId) return;
    const bmiResult = calculateBMI(log.weight, state.settings.height);

    try {
      await addWeightRecord({
        user_id: currentUserId,
        date: log.date,
        weight: log.weight,
        height: state.settings.height,
        bmi: bmiResult.value,
        memo: ''
      });

      const newLog: WeightRecord = {
        id: Math.random().toString(36).substr(2, 9),
        date: log.date,
        weight: log.weight,
        height: state.settings.height,
        bmi: bmiResult.value
      };
      setState(prev => ({ ...prev, weightLogs: [...prev.weightLogs, newLog].sort((a, b) => a.date.localeCompare(b.date)) }));
      alert('체중 기록이 저장되었습니다.');
    } catch (e) {
      alert('체중 기록 저장 실패: ' + e);
      console.error(e);
    }
  };

  const handleAddWorkout = async (workout: WorkoutRecord) => {
    if (!currentUserId) return;
    try {
      await addWorkoutRecord({
        user_id: currentUserId,
        ...workout
      });
      setState(prev => ({ ...prev, workouts: [...prev.workouts, workout] }));
      alert('운동 기록이 저장되었습니다.');
    } catch (e) {
      alert('운동 기록 저장 실패: ' + e);
      console.error(e);
    }
  };

  const handleToggleWorkout = (id: string) => {
    setState(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === id ? { ...w, completed: !w.completed } : w)
    }));
  };

  const handleAddHealthLog = async (log: HealthMetrics) => {
    if (!currentUserId) return;
    try {
      await addHealthMetric({
        user_id: currentUserId,
        ...log
      });
      setState(prev => ({ ...prev, healthLogs: [...prev.healthLogs, log] }));
      alert('건강 기록이 저장되었습니다.');
    } catch (e) {
      alert('건강 기록 저장 실패: ' + e);
      console.error(e);
    }
  };

  const handleUpdateSettings = async (settings: UserSettings) => {
    if (!currentUserId) return;
    try {
      const updatedUser = await updateUser(currentUserId, {
        name: settings.name,
        height: settings.height,
        target_weight: settings.targetWeight,
        goal: settings.goal,
        age: settings.age,
        gender: settings.gender
      });

      setState(prev => ({
        ...prev,
        settings: mapDBUserToSettings(updatedUser)
      }));
      alert('설정이 성공적으로 저장되었습니다.');
    } catch (e) {
      alert('설정 저장 실패: ' + e);
      console.error(e);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard state={state} />;
      case 'weight': return <WeightTracker state={state} onAddLog={handleAddWeightLog} />;
      case 'workout': return <WorkoutPlanner state={state} onAddWorkout={handleAddWorkout} />;
      case 'health': return <HealthTracker state={state} onAddLog={handleAddHealthLog} />;
      case 'calendar': return <CalendarView state={state} onToggleWorkout={handleToggleWorkout} />;
      case 'meal': return <MealAI state={state} />;
      case 'settings': return <SettingsView state={state} onUpdateSettings={handleUpdateSettings} />;
      default: return <Dashboard state={state} />;
    }
  };

  if (!isLoggedIn) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {!isSidebarOpen && (
        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-100">
          <Menu size={24} />
        </button>
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-8 border-b border-white/5">
          <div className="flex items-center gap-2 text-[#2DE2A6] font-black text-xl tracking-tighter">
            <Heart fill="currentColor" size={24} />
            <span>HealthHub AI</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-slate-500">
            <X size={20} />
          </button>
        </div>

        <nav className="p-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-[#2DE2A6] text-slate-900 shadow-lg shadow-[#2DE2A6]/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <span className={`${activeTab === item.id ? 'text-slate-900' : 'text-slate-500'}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="p-5 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#2DE2A6] rounded-2xl flex items-center justify-center text-slate-900 font-black">
                {state.settings.name.charAt(0)}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="font-bold text-sm text-white truncate">{state.settings.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{state.settings.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-red-500/10 text-xs font-black text-red-400 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
            >
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
