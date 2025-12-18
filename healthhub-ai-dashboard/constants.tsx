
import React from 'react';
import { 
  LayoutDashboard, 
  Scale, 
  Dumbbell, 
  Utensils, 
  HeartPulse, 
  Settings as SettingsIcon,
  Calendar
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard size={20} /> },
  { id: 'weight', label: '체중관리', icon: <Scale size={20} /> },
  { id: 'workout', label: '운동플래너', icon: <Dumbbell size={20} /> },
  { id: 'meal', label: 'AI 식단', icon: <Utensils size={20} /> },
  { id: 'health', label: '건강관리', icon: <HeartPulse size={20} /> },
  { id: 'calendar', label: '캘린더', icon: <Calendar size={20} /> },
  { id: 'settings', label: '설정', icon: <SettingsIcon size={20} /> },
];

export const COLORS = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
};
