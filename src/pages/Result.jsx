import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

function Result() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const departure = params.get("departure") || "미지의 공간";
  const budget = params.get("budget") || "알 수 없음";
  const mood = params.get("mood") || "기분전환";
  const withCompanion = params.get("withCompanion") === "true";
  const planId = params.get("planId"); // ✅ URL에서 받아온 공유용 ID
  const shareUrl = planId
    ? `${window.location.origin}/share/${planId}`
    : `${window.location.origin}`; // fallback

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
  const [schedule, setSchedule] = useState("⏳ 여행 일정을 불러오는 중입니다...");
  const [copied, setCopied] = useState(false);
  const lastRequestTimeRef = useRef(0);

  useEffect(() => {
    const randomPage = Math.floor(Math.random() * 10) + 1;
    const randomIndex = Math.floor(Math.random() * 5);

    fetch(`https://api.pexels.com/v1/search?query=${selected.city}&per_page=5&page=${randomPage}`, {
      headers: {
        Authorization: import.meta.env.VITE_PEXELS_API_KEY,
      },
    })
      .then(res => res.json())
      .then(data => {
        const fallbackImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
        const randomImage = data?.photos?.[randomIndex]?.src?.large || data?.photos?.[0]?.src?.large || fallbackImage;
        setImageUrl(randomImage);
      })
      .catch(() => {
        setImageUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e");
      });
  }, [selected.city]);

  useEffect(() => {
    const fetchThemeSentence = async () => {
      const now = Date.now();
      const cacheKey = `themeCache:${mood}:${departure}:${budget}`;

      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setAiMessage(cached);
        return;
      }

      if (now - lastRequestTimeRef.current < 10000) return;
      lastRequestTimeRef.current = now;

      const prompt = `감정: ${mood}, 출발지: ${departure}, 예산: ${budget}, 여행지: ${selected.city}에 어울리는 감성적인 한 문장의 여행 테마를 만들어줘.`;

      try {
        const res = await fetch("/api/generate-theme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        const data = await res.json();
        const msg = data.message || "여행 테마를 불러오는 데 문제가 발생했어요.";
        setAiMessage(msg);
        localStorage.setItem(cacheKey, msg);
      } catch {
        setAiMessage("AI 감성 문장을 불러오는 데 실패했어요.");
      }
    };

    fetchThemeSentence();
  }, [mood, departure, budget, selected.city]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood, destination: selected.city, days: 3 }),
        });

        const data = await res.json();
        setSchedule(data.text || "일정을 생성하지 못했습니다.");
      } catch {
        setSchedule("GPT로 여행 일정을 불러오는 데 실패했어요.");
      }
    };

    fetchSchedule();
  }, [mood, selected.city]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePreviewLink = () => {
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">✈️ 추천 여행지 결과</h1>

      <div className="text-left text-gray-700 mb-6 space-y-1">
        <p><strong>출발지:</strong> {departure}</p>
        <p><strong>예산:</strong> ₩{budget}</p>
        <p><strong>감정:</strong> {mood}</p>
        <p><strong>동행:</strong> {withCompanion ? "동행" : "혼자"}</p>
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">🎉 추천 여행지는…</h2>
      <h3 className="text-lg font-bold text-green-700 mb-2">{selected.city}</h3>
      <p className="text-gray-700 mb-4">{selected.message}</p>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={selected.city}
          className="w-full h-64 object-cover rounded-2xl shadow-lg mb-6"
        />
      )}

      <h2 className="text-xl font-semibold mb-3">💡 AI 감성 한 줄</h2>
      <div className="relative bg-gradient-to-br from-pink-100 to-yellow-100 border border-pink-200 rounded-2xl shadow-md p-6">
        <p className="text-lg leading-relaxed text-gray-800 font-serif italic whitespace-pre-line animate-fade-in">
          “{aiMessage}”
        </p>
        <div className="absolute top-0 right-0 p-2">
          <span className="text-pink-400 text-xl animate-pulse">💖</span>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-3">📅 GPT 여행 일정 추천</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow p-4 text-left whitespace-pre-wrap">
        {schedule}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleCopyLink}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full shadow transition"
        >
          🔗 여행 공유 링크 복사
        </button>
        <button
          onClick={handlePreviewLink}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-full shadow transition"
        >
          👀 공유 링크 미리 보기
        </button>
      </div>

      {copied && (
        <p className="mt-2 text-green-500 text-sm">복사 완료! 친구에게 공유해보세요 😊</p>
      )}
    </div>
  );
}

export default Result;