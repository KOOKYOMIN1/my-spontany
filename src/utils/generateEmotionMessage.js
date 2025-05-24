// src/utils/generateEmotionMessage.js
import axios from "axios";

export const generateEmotionMessage = async (emotion) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "너는 감성 여행 카피라이터야. 감정에 맞춰 여행 추천 문구를 1문장 생성해줘.",
          },
          {
            role: "user",
            content: `${emotion} 감정에 맞는 여행 문장을 하나 써줘`,
          },
        ],
        temperature: 0.8,
        max_tokens: 60,
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ 감정 문장 생성 실패:", error);
    return "여행은 언제나 당신에게 필요한 순간이에요 ✨";
  }
};