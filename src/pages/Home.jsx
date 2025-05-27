// 통합형 Home.jsx + Chat + TourAPI + GPT 일정 생성 기능 (직접 호출 방식 전체 구현)
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import ChatBox from "../components/ChatBox";
import { auth } from "../firebase";
import { saveUserPlan } from "../utils/saveUserPlan";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import "../index.css";

function Home() {
  const [departure, setDeparture] = useState("");
  const [budget, setBudget] = useState("");
  const [isWithCompanion, setIsWithCompanion] = useState(false);
  const [randomMatch, setRandomMatch] = useState(false);
  const [travelType, setTravelType] = useState("국내");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [matchUser, setMatchUser] = useState({ uid: "test-user" });
  const [showResult, setShowResult] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [tourData, setTourData] = useState([]);
  const [itinerary, setItinerary] = useState("");
  const today = new Date();

  const backgroundImage = "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')";

  useEffect(() => {
    if (showResult) {
      fetch(`https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${import.meta.env.VITE_TOURAPI_KEY}&numOfRows=6&pageNo=1&MobileOS=ETC&MobileApp=Spontany&_type=json&areaCode=1`)
        .then(res => res.json())
        .then(json => {
          const items = json.response.body.items?.item || [];
          setTourData(items);
        })
        .catch(err => console.error("TourAPI Error:", err));

      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

      const prompt = `당신은 감성적인 여행 플래너입니다.\n"기분전환" 감정을 주제로 "${departure}"에서 ${days}일간의 여행 일정을 하루 단위로 구성해 주세요.\n각 일정은 하루에 3~4개의 활동으로 구성해 주시고, 각 활동에는 짧고 감성적인 설명을 덧붙여 주세요.\n친절하고 감성적인 어조를 유지해 주세요.`;

      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
          temperature: 0.85,
        }),
      })
        .then(res => res.json())
        .then(data => {
          const text = data.choices?.[0]?.message?.content?.trim();
          setItinerary(text || "일정 생성 실패");
        })
        .catch(err => {
          console.error("GPT Error:", err);
          setItinerary("일정 생성 중 오류 발생");
        });
    }
  }, [showResult]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center py-16 px-4 relative"
      style={{ backgroundImage }}
    >
      <div className="w-[1200px] bg-white bg-opacity-90 backdrop-blur-lg rounded-[2rem] shadow-xl p-10 border border-gray-200 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          랜덤 동행 감성 여행 만들기
        </h1>

        <div className="flex justify-center gap-4 mb-8">
          {["국내", "해외"].map((type, idx) => (
            <button
              key={type}
              type="button"
              onClick={() => setTravelType(type)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md ${
                travelType === type
                  ? "bg-yellow-600 text-white scale-105"
                  : idx === 0
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input
            type="text"
            placeholder="출발지를 입력하세요"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="w-full px-4 py-[10px] text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
          <input
            type="number"
            placeholder="예산 (₩)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-4 py-[10px] text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              if (endDate && date > endDate) {
                setEndDate(null);
              }
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={today}
            locale={ko}
            dateFormat="yyyy년 MM월 dd일"
            placeholderText="출발 날짜 선택"
            className="w-full px-4 py-[10px] text-sm border border-gray-200 bg-gray-50 rounded-full text-center focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || today}
            locale={ko}
            dateFormat="yyyy년 MM월 dd일"
            placeholderText="돌아오는 날짜 선택"
            fixedHeight
            className="w-full px-4 py-[10px] text-sm border border-gray-200 bg-gray-50 rounded-full text-center focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button type="button" onClick={() => { setIsWithCompanion(false); setRandomMatch(false); }} className={`px-5 py-[6px] text-sm font-medium rounded-full shadow-md transition-all duration-200 ${!isWithCompanion && !randomMatch ? "bg-gray-600 text-white scale-105" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}>혼자 여행</button>
          <button type="button" onClick={() => { setIsWithCompanion(true); setRandomMatch(false); }} className={`px-5 py-[6px] text-sm font-medium rounded-full shadow-md transition-all duration-200 ${isWithCompanion && !randomMatch ? "bg-teal-600 text-white scale-105" : "bg-teal-100 text-teal-800 hover:bg-teal-200"}`}>동행 있음</button>
          <button type="button" onClick={() => { setIsWithCompanion(true); setRandomMatch(true); }} className={`px-5 py-[6px] text-sm font-medium rounded-full shadow-md transition-all duration-200 ${randomMatch ? "bg-rose-600 text-white scale-105" : "bg-rose-100 text-rose-800 hover:bg-rose-200"}`}>랜덤 동행</button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setShowResult(true)}
            className="w-60 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-[10px] rounded-full transition duration-300 shadow-lg hover:scale-105"
          >
            여행 계획하기
          </button>
        </div>
      </div>

      {showResult && (
        <div className="w-[1200px] mt-12 mb-20">
          <div className="text-center text-white text-base mb-6">
            한국관광공사 TourAPI로 가져온 서울 지역 관광지입니다.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tourData.map((item) => (
              <div key={item.contentid} className="bg-white bg-opacity-90 p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-bold mb-2 text-gray-800">{item.title}</h3>
                <img
                  src={item.firstimage || "https://via.placeholder.com/400x200?text=No+Image"}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <p className="text-sm text-gray-600">{item.addr1}</p>
              </div>
            ))}
          </div>
          <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4"> GPT 기반 추천 일정</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{itinerary || "일정 생성 중입니다..."}</pre>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white text-xl shadow-lg flex items-center justify-center hover:bg-blue-700 z-50"
      >
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