
import React, { useState } from 'react';
import { AppState, WorkoutRecord } from '../types';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';

interface CalendarViewProps {
  state: AppState;
  onToggleWorkout: (id: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ state, onToggleWorkout }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const workoutsForDate = state.workouts.filter(w => w.date === selectedDate);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
      <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-800">
            {year}년 {month + 1}월
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronLeft /></button>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronRight /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center mb-4">
          {['일', '월', '화', '수', '목', '금', '토'].map(d => (
            <span key={d} className="text-xs font-bold text-slate-400 uppercase">{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            if (!day) return <div key={idx} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;
            const hasWorkout = state.workouts.some(w => w.date === dateStr);
            const allCompleted = hasWorkout && state.workouts.filter(w => w.date === dateStr).every(w => w.completed);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(dateStr)}
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all relative
                  ${isSelected ? 'bg-slate-900 text-white shadow-xl scale-105 z-10' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}
                `}
              >
                <span className="text-lg font-bold">{day}</span>
                {hasWorkout && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${allCompleted ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
            {selectedDate} 기록
            <span className="text-xs text-slate-400">{workoutsForDate.length}건</span>
          </h3>

          <div className="space-y-4">
            {workoutsForDate.length > 0 ? (
              workoutsForDate.map(workout => (
                <div key={workout.id} className={`p-4 rounded-2xl border transition-all ${workout.completed ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-bold ${workout.completed ? 'text-emerald-700 line-through opacity-60' : 'text-slate-800'}`}>
                        {workout.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{workout.type} · {workout.duration}분 · {workout.calories}kcal</p>
                    </div>
                    <button 
                      onClick={() => onToggleWorkout(workout.id)}
                      className={`p-2 rounded-xl transition-all ${workout.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-400'}`}
                    >
                      {workout.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-slate-300">
                <p className="text-sm font-medium">등록된 운동이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
