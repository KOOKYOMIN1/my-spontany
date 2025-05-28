// ✅ 통합형 Home.jsx (매칭 제한, 프리미엄, 감정/스타일 필터, 채팅 포함 완성본)

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import ChatBox from "../components/ChatBox";
import { auth } from "../firebase";
import "../index.css";

const CITY_SUGGESTIONS = ["서울", "부산", "제주", "대구", "인천", "광주", "대전", "울산", "강릉", "속초", "여수", "전주", "경주"];

function Home() {
  const [origin, setOrigin] = useState("");
  const [departure, setDeparture] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [budget, setBudget] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [matchUser, setMatchUser] = useState({ uid: "test-user" });
  const [showResult, setShowResult] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [itinerary, setItinerary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mood, setMood] = useState("");
  const [style, setStyle] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const today = new Date();

  const backgroundImage = "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')";

  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const saved = JSON.parse(localStorage.getItem("matchStatus") || '{}');
    if (saved[todayKey]) setMatchCount(saved[todayKey]);
  }, []);

  const saveMatch = () => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const saved = JSON.parse(localStorage.getItem("matchStatus") || '{}');
    saved[todayKey] = (saved[todayKey] || 0) + 1;
    localStorage.setItem("matchStatus", JSON.stringify(saved));
    setMatchCount(saved[todayKey]);
  };

  const formatBudget = (value) => {
    const numeric = value.replace(/[^0-9]/g, "");
    return numeric ? parseInt(numeric).toLocaleString() : "";
  };

  const handleBudgetChange = (e) => {
    const input = e.target.value;
    setBudget(formatBudget(input));
  };

  const generatePrompt = (origin, destination, days, budget, mood, style) => {
    return `여러 명이 함께 국내 여행을 갑니다.\n\n- 여행에 참여한 사람들의 예산은 다양하지만,\n- 모두가 편하게 부담할 수 있도록 가장 무리가 없는 수준에서 일정을 구성해주세요.\n- 총 여행 예산은 약 ${budget.toLocaleString()}원입니다.\n- 감정은 '${mood}', 여행 스타일은 '${style}'입니다.\n- 출발지는 ${origin}, 도착지는 ${destination}이며 대중교통을 이용해요.\n- ${days}일 일정이고, 감성적이고 여유로운 시간을 보낼 수 있는 구성으로 부탁해요.\n\n시간대별 일정과 대략적인 비용을 알려주되,\n너무 고가의 옵션은 피하고, 선택 가능한 여지도 함께 제안해줘요.`;
  };

  const generateItinerary = async () => {
    if (!departure || !startDate || !endDate || !mood || !style) return;
    setIsLoading(true);
    setItinerary("");
    const days = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);
    const parsedBudget = parseInt(budget.replace(/[^0-9]/g, "")) || 0;
    const prompt = generatePrompt(origin, departure, days, parsedBudget, mood, style);

    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const text = data.message?.trim();
      setItinerary(text || "일정 생성 실패");
    } catch (err) {
      console.error("GPT Error:", err);
      setItinerary("일정 생성 중 오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = () => {
    if (!isPremium && matchCount >= 2) {
      alert("오늘의 무료 매칭 2회를 모두 사용하셨습니다. 프리미엄으로 전환해보세요.");
      return;
    }
    saveMatch();
    setIsLoading(true);
    setShowResult(true);
    setItinerary("");
    generateItinerary();
  };

  useEffect(() => {
    if (departure) {
      const results = CITY_SUGGESTIONS.filter(city => city.includes(departure)).slice(0, 5);
      setFilteredCities(results);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [departure]);

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center py-16 px-4 relative" style={{ backgroundImage }}>
      <div className="w-[1200px] bg-white bg-opacity-90 backdrop-blur-lg rounded-[2rem] shadow-xl p-10 border border-gray-200 animate-fade-in mb-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">랜덤 동행 감성 여행 만들기</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input type="text" placeholder="출발지" value={origin} onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none" />
          <div className="relative">
            <input type="text" placeholder="도착지" value={departure} onChange={(e) => setDeparture(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} onFocus={() => setShowSuggestions(true)}
              className="w-full px-4 py-2 text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none" />
            {showSuggestions && filteredCities.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-md max-h-48 overflow-y-auto text-sm">
                {filteredCities.map((city) => (
                  <li key={city} onClick={() => { setDeparture(city); setShowSuggestions(false); }}
                    className="px-4 py-2 hover:bg-yellow-100 cursor-pointer">{city}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input type="text" placeholder="예산 (₩)" value={budget} onChange={handleBudgetChange}
            className="w-full px-4 py-2 text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none" />
          <DatePicker selected={startDate} onChange={(update) => setDateRange(update)}
            startDate={startDate} endDate={endDate} selectsRange minDate={today} locale={ko}
            dateFormat="yyyy년 MM월 dd일" placeholderText="여행 날짜 선택"
            className="w-full px-4 py-2 text-sm border border-gray-200 bg-gray-50 rounded-full text-center focus:ring-2 focus:ring-yellow-300 focus:outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <select value={mood} onChange={(e) => setMood(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-200 bg-gray-50 rounded-full">
            <option value="">감정을 선택하세요</option>
            <option value="설렘">설렘</option>
            <option value="힐링">힐링</option>
            <option value="기분전환">기분전환</option>
          </select>
          <select value={style} onChange={(e) => setStyle(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-200 bg-gray-50 rounded-full">
            <option value="">여행 스타일 선택</option>
            <option value="즉흥형">즉흥형</option>
            <option value="계획형">계획형</option>
          </select>
        </div>

        <button onClick={handleGeneratePlan}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-full transition duration-300 shadow-lg hover:scale-105">
          여행 계획하기
        </button>

        {isPremium ? null : (
          <p className="text-xs text-center mt-4 text-gray-500">무료 유저는 하루 2회까지 여행 매칭이 가능해요.</p>
        )}
      </div>

      {showResult && (
        <div className="w-[1200px] mt-12 mb-20">
          <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4"> GPT 기반 추천 일정</h2>
            {isLoading ? (
              <p className="text-sm text-gray-500">잠시만 기다려주세요, 일정 생성 중입니다...</p>
            ) : itinerary ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{itinerary}</pre>
            ) : (
              <p className="text-sm text-gray-400">아직 생성된 일정이 없습니다. 여행 계획하기 버튼을 눌러주세요.</p>
            )}
          </div>
        </div>
      )}

      <button onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white text-xl shadow-lg flex items-center justify-center hover:bg-blue-700 z-50">
        💬
      </button>
      {showChat && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-xl shadow-xl p-4 z-40">
          <h2 className="text-lg font-semibold mb-2">실시간 채팅</h2>
          <ChatBox matchId={`match-${auth.currentUser?.uid || "local"}-${matchUser.uid}`} />
        </div>
      )}
    </div>
  );
}

export default Home;
