import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

function Result() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const departure = params.get("departure");
  const budget = params.get("budget");
  const mood = params.get("mood");
  const companion = params.get("companion");

  const emotionToCityMap = {
    기분전환: { city: "Bangkok", message: "바쁜 일상 속, 방콕에서 활력을 찾아보세요 🌇" },
    힐링: { city: "Bali", message: "발리의 따뜻한 바람이 당신을 감싸줄 거예요 🌴" },
    설렘: { city: "Paris", message: "파리의 밤, 에펠탑 아래 당신의 마음이 두근거릴 거예요 💘" },
  };

  const selected = emotionToCityMap[mood] || {
    city: "오사카",
    message: "오사카에서 맛있는 음식과 힐링을 동시에 즐겨보세요 🍜",
  };

  const [imageUrl, setImageUrl] = useState("");
  const [aiMessage, setAiMessage] = useState("⏳ 감성 문장을 생성 중입니다...");
  const [copied, setCopied] = useState(false);
  const lastRequestTimeRef = useRef(0);

  useEffect(() => {
    if (selected.city !== "오사카") {
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const randomIndex = Math.floor(Math.random() * 5);

      fetch(`https://api.pexels.com/v1/search?query=${selected.city}&per_page=5&page=${randomPage}`, {
        headers: {
          Authorization: import.meta.env.VITE_PEXELS_API_KEY,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.photos.length > 0) {
            const randomImage = data.photos[randomIndex]?.src?.large || data.photos[0].src.large;
            setImageUrl(randomImage);
            console.log("📸 랜덤 이미지:", randomImage);
          }
        })
        .catch(err => {
          console.error("❌ Pexels 이미지 불러오기 실패:", err);
        });
    }
  }, [selected.city]);

  useEffect(() => {
    const fetchThemeSentence = async () => {
      const now = Date.now();
      const cacheKey = `themeCache:${mood}:${departure}:${budget}`;

      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        console.log("♻️ 캐시된 문장 사용:", cached);
        setAiMessage(cached);
        return;
      }

      if (now - lastRequestTimeRef.current < 10000) {
        console.log("⏳ 쿨타임 중 - 요청 차단");
        return;
      }

      lastRequestTimeRef.current = now;

      const prompt = `감정: ${mood}, 출발지: ${departure}, 예산: ${budget}, 여행지: ${selected.city}에 어울리는 감성적인 한 문장의 여행 테마를 만들어줘.`;

      try {
        const res = await fetch("/api/generate-theme", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        const data = await res.json();
        console.log("🌈 GPT 응답:", data);

        const msg = data.message || "여행 테마를 불러오는 데 문제가 발생했어요.";
        setAiMessage(msg);
        localStorage.setItem(cacheKey, msg);
      } catch (error) {
        console.error("❌ GPT 프록시 호출 실패:", error);
        setAiMessage("여행 테마를 불러오는 데 실패했어요.");
      }
    };

    fetchThemeSentence();
  }, [mood, departure, budget, selected.city]);

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

      <h2 className="text-xl font-semibold mb-3">💡 AI 감성 한 줄</h2>

      {/* 🎨 감성 문장 영역 리디자인 */}
      <div className="relative bg-gradient-to-br from-pink-50 to-yellow-50 border border-pink-200 rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
        <p className="text-lg leading-relaxed text-gray-800 font-serif italic whitespace-pre-line animate-fade-in">
          “{aiMessage}”
        </p>
        <div className="absolute top-0 right-0 p-2">
          <span className="text-pink-400 text-xl animate-pulse">💖</span>
        </div>
      </div>

      <button
        onClick={handleCopyLink}
        className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
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