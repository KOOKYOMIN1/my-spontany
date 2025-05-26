import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Leaf, Moon, Sparkles } from "lucide-react";

function FlightSearch({ originCity, destinationCity }) {
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  const handleSearch = () => {
    alert(`\n출발지: ${originCity}\n도착지: ${destinationCity}\n출발일: ${date}\n인원: ${passengers}명`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-yellow-300 focus:outline-none text-sm w-44"
      />
      <select
        value={passengers}
        onChange={(e) => setPassengers(e.target.value)}
        className="px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-yellow-300 focus:outline-none text-sm w-32"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}명</option>
        ))}
      </select>
      <button
        onClick={handleSearch}
        className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full text-sm shadow"
      >
        검색
      </button>
    </div>
  );
}

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
  const [selectedImage, setSelectedImage] = useState(null);
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

  const selected = cityMap[mood] || {
    city: "오사카",
    message: "오사카에서 맛있는 음식과 힐링을 동시에 즐겨보세요",
  };

  useEffect(() => {
    fetch(`https://api.pexels.com/v1/search?query=${selected.city}&per_page=10`, {
      headers: { Authorization: import.meta.env.VITE_PEXELS_API_KEY },
    })
      .then((res) => res.json())
      .then((data) => {
        const fallback = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
        const images = data?.photos?.map((p) => p.src.medium) || [fallback];
        setImageList(images.length > 0 ? images : [fallback]);
      })
      .catch(() =>
        setImageList(["https://images.unsplash.com/photo-1507525428034-b723cf961d3e"])
      );
  }, [selected.city]);

  useEffect(() => {
    const now = Date.now();
    if (now - lastRequestTimeRef.current < 10000) return;
    lastRequestTimeRef.current = now;

    const prompt = `${mood}, ${departure}, ${budget} 예산의 감성 여행 문장`;

    fetch("/api/generate-theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
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

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">✈️ 항공권 검색</h2>
        <FlightSearch originCity={departure} destinationCity={selected.city} />
      </div>

      {imageList.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {imageList.slice(0, 8).map((src, index) => (
            <div
              key={index}
              className="h-24 cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-white flex items-center justify-center hover:scale-110 hover:shadow-2xl transition-all duration-300 ease-out"
              onClick={() => {
                console.log("이미지 클릭됨:", src);
                setSelectedImage(src);
              }}
            >
              <img
                src={src}
                alt={`여행지 이미지 ${index + 1}`}
                onError={() => console.log("이미지 로드 실패:", src)}
                className="h-full w-auto object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="확대된 이미지"
            className="rounded-3xl shadow-2xl transition-transform duration-300 ease-in-out max-w-[90vw] max-h-[90vh] hover:scale-110 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center shadow">
        <p className="text-lg font-serif italic">“{aiMessage}”</p>
      </div>

      <div className="bg-white border rounded-lg p-4 whitespace-pre-wrap shadow text-gray-700">
        {schedule}
      </div>
    </div>
  );
}

export default Result;
