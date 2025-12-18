
import { BMIStatus, HealthMetrics } from "../types";

export function calculateBMI(weight: number, height: number): { value: number, status: BMIStatus } {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let status = BMIStatus.NORMAL;

  if (bmi < 18.5) status = BMIStatus.UNDERWEIGHT;
  else if (bmi < 25) status = BMIStatus.NORMAL;
  else if (bmi < 30) status = BMIStatus.OVERWEIGHT;
  else status = BMIStatus.OBESE;

  return { value: Number(bmi.toFixed(1)), status };
}

export function getBPStatus(systolic: number, diastolic: number): { label: string, color: string, level: 'normal' | 'warning' | 'danger' } {
  if (systolic < 120 && diastolic < 80) return { label: '정상', color: 'text-emerald-500', level: 'normal' };
  if (systolic < 140 && diastolic < 90) return { label: '주의', color: 'text-amber-500', level: 'warning' };
  return { label: '위험', color: 'text-rose-500', level: 'danger' };
}

export function getSugarStatus(sugar: number): { label: string, color: string, level: 'normal' | 'warning' | 'danger' } {
  if (sugar < 100) return { label: '정상', color: 'text-emerald-500', level: 'normal' };
  if (sugar < 126) return { label: '주의', color: 'text-amber-500', level: 'warning' };
  return { label: '위험', color: 'text-rose-500', level: 'danger' };
}

export function calculateConditionScore(
  weightLoggedToday: boolean,
  workoutCompletedToday: boolean,
  sleepHours: number,
  lastHealth: HealthMetrics | undefined
): number {
  let score = 0;
  
  // Weight Log: 15pts
  if (weightLoggedToday) score += 15;
  
  // Workout: 35pts
  if (workoutCompletedToday) score += 35;
  
  // Sleep: 30pts (Optimal 7-9 hours)
  if (sleepHours >= 7 && sleepHours <= 9) score += 30;
  else if (sleepHours >= 6 || sleepHours === 10) score += 20;
  else if (sleepHours > 0) score += 10;

  // Health Metrics: 20pts
  if (lastHealth) {
    const bp = getBPStatus(lastHealth.systolic, lastHealth.diastolic);
    const sugar = getSugarStatus(lastHealth.bloodSugar);
    if (bp.level === 'normal') score += 10;
    if (sugar.level === 'normal') score += 10;
  }
  
  return score;
}
