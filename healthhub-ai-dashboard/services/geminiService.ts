
import { GoogleGenAI, Type } from "@google/genai";
import { UserSettings } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface DietRequest {
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  mealTime: string;
  activityLevel: string;
  allergies?: string;
  preferences?: string;
  notes?: string;
  targetKcal: number;
}

export async function getDietRecommendation(req: DietRequest) {
  try {
    const prompt = `
      사용자 정보: 나이 ${req.age}세, 성별 ${req.gender}, 키 ${req.height}cm, 체중 ${req.weight}kg
      활동 수준: ${req.activityLevel}
      식단 목표: ${req.goal}
      추천받을 식사 시간: ${req.mealTime}
      일일 목표 칼로리: ${req.targetKcal} kcal
      기호 및 제한사항:
      - 알레르기/제외 음식: ${req.allergies || '없음'}
      - 선호 스타일: ${req.preferences || '없음'}
      - 추가 요청: ${req.notes || '없음'}

      위 정보를 바탕으로 최적의 건강 식단을 한국어로 추천해주세요. 
      결과는 반드시 JSON 형식으로 반환해야 하며, 각 식사(아침, 점심, 저녁, 간식)에 대한 구체적인 메뉴와 해당 식사의 칼로리, 그리고 AI 전문가의 조언을 포함하세요.
      목표 칼로리에 최대한 맞춘 균형 잡힌 영양 성분(탄단지)을 고려하세요.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "식단의 제목" },
            breakfast: { type: Type.STRING, description: "아침 메뉴와 설명" },
            lunch: { type: Type.STRING, description: "점심 메뉴와 설명" },
            dinner: { type: Type.STRING, description: "저녁 메뉴와 설명" },
            snack: { type: Type.STRING, description: "간식 메뉴와 설명" },
            totalKcal: { type: Type.NUMBER, description: "추천된 식단의 총 칼로리" },
            tip: { type: Type.STRING, description: "전문가 조언 및 팁" },
            nutrition: {
              type: Type.OBJECT,
              properties: {
                carbs: { type: Type.STRING },
                protein: { type: Type.STRING },
                fat: { type: Type.STRING }
              }
            }
          },
          required: ["title", "breakfast", "lunch", "dinner", "totalKcal", "tip"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return {
      title: "기본 추천 식단",
      breakfast: "호밀빵 샌드위치와 저지방 우유",
      lunch: "현미밥과 닭가슴살 야채 볶음",
      dinner: "두부 샐러드와 삶은 계란",
      snack: "견과류 한 줌",
      totalKcal: req.targetKcal,
      tip: "일시적인 통신 오류로 기본 식단을 제공합니다. 규칙적인 식사가 가장 중요합니다."
    };
  }
}
