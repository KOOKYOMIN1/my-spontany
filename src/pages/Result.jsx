import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { generateEmotionMessage } from "../utils/generateEmotionMessage"; // ✅ AI 문장 생성기

function Result() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const mood = params.get("mood");
  const departure = params.get("departure");
  const budget = params.get("budget");
  const companion = params.get("companion");

  const [aiMessage, setAiMessage] = useState("");

  useEffect(() => {
    if (mood) {
      generateEmotionMessage(mood).then(setAiMessage);
    }
  }, [mood]);

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">✈️ 추천 여행지 결과</h1>
      <p><strong>출발지:</strong> {departure}</p>
      <p><strong>예산:</strong> ₩{budget}</p>
      <p><strong>감정:</strong> {mood}</p>
      <p><strong>동행:</strong> {companion === "true" ? "동행" : "혼자"}</p>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">🎉 AI 감성 한 줄 추천</h2>
      <p className="text-lg text-gray-800 mb-6">
        {aiMessage || "문장을 생성 중입니다..."}
      </p>
    </div>
  );
}

export default Result;