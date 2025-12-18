
export enum HealthGoal {
  MAINTAIN = '건강유지',
  DIET = '다이어트',
  GAIN = '체중증량'
}

export enum BMIStatus {
  UNDERWEIGHT = '저체중',
  NORMAL = '정상',
  OVERWEIGHT = '과체중',
  OBESE = '비만'
}

export interface WeightRecord {
  id: string;
  date: string;
  weight: number;
  height?: number;
  bmi: number;
  memo?: string;
}

export interface WorkoutRecord {
  id: string;
  date: string;
  category: string;
  type: string;
  intensity: '낮음' | '보통' | '높음';
  duration: number; // minutes
  met: number;
  calories: number;
  completed: boolean;
  title: string;
  memo?: string;
}

export interface HealthMetrics {
  systolic: number;
  diastolic: number;
  bloodSugar: number;
  sleepHours: number;
  date: string;
}

export interface UserSettings {
  name: string;
  email: string;
  height: number;
  targetWeight: number;
  goal: HealthGoal;
  age: number;
  gender: '남' | '여';
}

export interface AppState {
  settings: UserSettings;
  weightLogs: WeightRecord[];
  workouts: WorkoutRecord[];
  healthLogs: HealthMetrics[];
}
