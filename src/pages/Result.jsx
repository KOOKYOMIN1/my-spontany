import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { generateEmotionMessage } from "../utils/generateEmotionMessage";

function Result() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const mood = params.get("mood");
  const departure = params.get("departure");
  const budget = params.get("budget");
  const companion = params.get("companion");

  const [aiMessage, setAiMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const emotionToCityMap = {
    기분전환: { city: "Bangkok", message: "바쁜 일상 속, 방콕에서 활력을 찾아보세요 🌇" },
    힐링: { city: "Bali", message: "발리의 따뜻한 바람이 당신을 감싸줄 거예요 🌴" },
    설렘: { city: "Paris", message: "파리의 밤, 에펠탑 아래 당신의 마음이 두근거릴 거예요 💘" },
  };

  const selected = emotionToCityMap[mood] || {
    city: "오사카",
    message: "오사카에서 맛있는 음식과 힐링을 동시에 즐겨보세요 🍜",
  };

  useEffect(() => {
    if (selected.city !== "오사카") {
      fetch(`https://api.pexels.com/v1/search?query=${selected.city}&per_page=1`, {
        headers: {
          Authorization: import.meta.env.VITE_PEXELS_API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.photos.length > 0) {
            setImageUrl(data.photos[0].src.large);
          }
        });
    }
  }, [selected.city]);

  useEffect(() => {
    if (mood) {
      generateEmotionMessage(mood).then(setAiMessage);
    }
  }, [mood]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">✈️ 추천 여행지 결과</h1>
      <p><strong>출발지:</strong> {departure}</p>
      <p><strong>예산:</strong> ₩{budget}</p>
      <p><strong>감정:</strong> {mood}</p>
      <p><strong>동행:</strong> {companion === "true" ? "동행" : "혼자"}</p>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">🎉 추천 여행지는…</h2>
      <h3 className="text-lg font-bold text-green-700 mb-2">{selected.city}</h3>
      <p className="text-gray-700 mb-4">{selected.message}</p>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={selected.city}
          className="w-full h-64 object-cover rounded-2xl shadow mb-6"
        />
      )}

      <h2 className="text-xl font-semibold mb-2">💡 AI 감성 한 줄</h2>
      <p className="text-lg text-gray-800 mb-6">{aiMessage || "문장을 생성 중입니다..."}</p>

      <button
        onClick={handleCopyLink}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
      >
        🔗 여행 계획 링크 복사
      </button>
      {copied && (
        <p className="mt-2 text-green-500 text-sm">
          복사 완료! 친구에게 공유해보세요 😎
        </p>
      )}
    </div>
  );
}

export default Result;