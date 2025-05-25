// ✅ /result 페이지에서 Lucide 아이콘 기반 감성 표현 적용
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Leaf, Moon, Sparkles } from "lucide-react";
import FlightSearch from "../components/FlightSearch";

function Result() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const departure = params.get("departure") || "미지의 공간";
  const budget = params.get("budget") || "알 수 없음";
  const mood = params.get("mood") || "기분전환";
  const withCompanion = params.get("withCompanion") === "true";

  const [aiMessage, setAiMessage] = useState("감성 문장을 생성 중입니다...");
  const [schedule, setSchedule] = useState("여행 일정을 불러오는 중입니다...");
  const [imageList, setImageList] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const lastRequestTimeRef = useRef(0);

  const emotionToIcon = {
    기분전환: <Leaf className="inline-block w-5 h-5 text-green-500" />,
    힐링: <Moon className="inline-block w-5 h-5 text-indigo-500" />,
    설렘: <Sparkles className="inline-block w-5 h-5 text-pink-500" />,
  };

  const cityMap = {
    기분전환: { city: "Bangkok", message: "바쁜 일상 속, 방콕에서 활력을 찾아보세요" },
    힐링: { city: "Bali", message: "발리의 따뜻한 바람이 당신을 감싸줄 거예요" },
    설렘: { city: "Paris", message: "파리의 밤, 에펠탑 아래 당신의 마음이 두근거릴 거예요" },
  };

  const selected = cityMap[mood] || { city: "오사카", message: "오사카에서 맛있는 음식과 힐링을 동시에 즐겨보세요" };

  useEffect(() => {
    fetch(`https://api.pexels.com/v1/search?query=${selected.city}&per_page=5`, {
      headers: { Authorization: import.meta.env.VITE_PEXELS_API_KEY },
    })
      .then((res) => res.json())
      .then((data) => {
        const fallback = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
        const images = data?.photos?.map((p) => p.src.large) || [fallback];
        setImageList(images);
      })
      .catch(() => setImageList(["https://images.unsplash.com/photo-1507525428034-b723cf961d3e"]));
  }, [selected.city]);

  useEffect(() => {
    const now = Date.now();
    if (now - lastRequestTimeRef.current < 10000) return;
    lastRequestTimeRef.current = now;

    fetch("/api/generate-theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `${mood}, ${departure}, ${budget} 예산의 감성 여행 문장` }),
    })
      .then((res) => res.json())
      .then((data) => setAiMessage(data.message || "여행 테마를 불러오지 못했습니다."))
      .catch(() => setAiMessage("AI 감성 문장을 불러오는 데 실패했어요."));
  }, [mood, departure, budget]);

  useEffect(() => {
    fetch("/api/generate-itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, destination: selected.city, days: 3 }),
    })
      .then((res) => res.json())
      .then((data) => setSchedule(data.text || "일정을 불러오지 못했습니다."))
      .catch(() => setSchedule("GPT로 여행 일정을 불러오는 데 실패했어요."));
  }, [mood, selected.city]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">추천 여행지 결과</h1>
      <div className="text-center text-gray-600">
        출발지: {departure} / 예산: ₩{budget} / 감정: {emotionToIcon[mood]} {mood} / 동행: {withCompanion ? "함께" : "혼자"}
      </div>

      <div className="text-center text-xl font-semibold text-green-700">
          추천 도시: {selected.city}
      </div>
      <p className="text-center italic text-gray-500">{selected.message}</p>

      {imageList.length > 0 && (
        <img
          src={imageList[imageIndex]}
          alt="여행지"
          className="w-full h-64 object-cover rounded-xl shadow"
        />
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center shadow">
        <p className="text-lg font-serif italic">“{aiMessage}”</p>
      </div>

      <div className="bg-white border rounded-lg p-4 whitespace-pre-wrap shadow text-gray-700">
        {schedule}
      </div>

      <FlightSearch originCity={departure} destinationCity={selected.city} />
    </div>
  );
}

export default Result;
