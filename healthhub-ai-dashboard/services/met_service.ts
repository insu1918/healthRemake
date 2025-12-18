
export const MET_DATA: Record<string, { name: string; met: number }[]> = {
  "유산소": [
    { name: "걷기", met: 3.5 },
    { name: "조깅", met: 7.0 },
    { name: "러닝", met: 9.8 },
    { name: "자전거", met: 6.8 },
    { name: "수영", met: 8.0 }
  ],
  "근력": [
    { name: "데드리프트", met: 6.0 },
    { name: "스쿼트", met: 5.0 },
    { name: "벤치프레스", met: 6.0 },
    { name: "푸쉬업", met: 8.0 }
  ],
  "코어": [
    { name: "플랭크", met: 3.8 },
    { name: "크런치", met: 4.0 },
    { name: "레그레이즈", met: 4.0 }
  ],
  "스트레칭": [
    { name: "요가", met: 2.5 },
    { name: "필라테스", met: 3.0 },
    { name: "정적 스트레칭", met: 2.3 }
  ]
};

export function calculateCalories(met: number, weight: number, durationMin: number): number {
  return Math.round(met * weight * (durationMin / 60));
}
