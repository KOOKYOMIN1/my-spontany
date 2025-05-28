import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import ChatBox from "../components/ChatBox";
import { auth } from "../firebase";
import "../index.css";

const CITY_SUGGESTIONS = [
  "서울", "부산", "제주", "대구", "인천", "광주", "대전", "울산", "강릉", "속초", "여수", "전주", "경주"
];

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
  const [tourData, setTourData] = useState([]);
  const [itinerary, setItinerary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date();

  const backgroundImage = "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')";

  const formatBudget = (value) => {
    const numeric = value.replace(/[^0-9]/g, "");
    return numeric ? parseInt(numeric).toLocaleString() : "";
  };

  const handleBudgetChange = (e) => {
    const input = e.target.value;
    setBudget(formatBudget(input));
  };

  const generateItinerary = async () => {
  if (!departure || !startDate || !endDate) return;
  setIsLoading(true);
  setItinerary("");
  const days = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);
  const parsedBudget = parseInt(budget.replace(/[^0-9]/g, "")) || 0;

  const prompt = `당신은 감성적인 여행 플래너입니다.
사용자는 "${origin}"에서 출발하여 "${departure}"로 여행을 갑니다.
"기분전환" 감정을 주제로 ${days}일간의 여행 일정을 하루 단위로 구성해 주세요.
사용자의 여행 예산은 총 ${parsedBudget.toLocaleString()}원입니다.
예산을 초과하지 않도록 교통비, 숙박비, 식비, 체험 비용 등을 현실적인 범위 내에서 감성적으로 배분해주세요.
만약 예산이 0원이면 무자금 여행을 할 수 있도록 히치하이킹, 무료 숙소, 공공시설 등을 활용해 주세요.
각 일정은 하루에 3~4개의 활동으로 구성하고, 각 활동에는 짧고 감성적인 설명을 덧붙여 주세요.
친절하고 감성적인 어조를 유지해 주세요.`;

  try {
    const res = await fetch("/api/generate-theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    const text = data.message?.trim();
    setItinerary(text || "일정 생성 실패");
  } catch (err) {
    console.error("GPT Proxy Error:", err);
    setItinerary("일정 생성 중 오류 발생");
  } finally {
    setIsLoading(false);
  }
};
  const handleGeneratePlan = () => {
    setIsLoading(true);
    setShowResult(true);
    setItinerary("");

    fetch(`https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${import.meta.env.VITE_TOURAPI_KEY}&numOfRows=6&pageNo=1&MobileOS=ETC&MobileApp=Spontany&_type=json&areaCode=1`)
      .then(res => res.json())
      .then(json => {
        const items = json.response.body.items?.item || [];
        setTourData(items);
      })
      .catch(err => console.error("TourAPI Error:", err));

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
          <input
            type="text"
            placeholder="출발지를 입력하세요"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-4 py-[10px] text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
          <div className="relative w-full">
            <input
              type="text"
              placeholder="도착지를 입력하세요"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-4 py-[10px] text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none"
            />
            {showSuggestions && filteredCities.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-md max-h-48 overflow-y-auto text-sm">
                {filteredCities.map((city) => (
                  <li
                    key={city}
                    onClick={() => {
                      setDeparture(city);
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-2 hover:bg-yellow-100 cursor-pointer"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input
            type="text"
            placeholder="예산 (₩)"
            value={budget}
            onChange={handleBudgetChange}
            className="w-full px-4 py-[10px] text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
          <DatePicker
            selected={startDate}
            onChange={(update) => setDateRange(update)}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            minDate={today}
            locale={ko}
            dateFormat="yyyy년 MM월 dd일"
            placeholderText="여행 날짜 선택 (출발 ~ 도착)"
            className="w-full px-4 py-[10px] text-sm border border-gray-200 bg-gray-50 rounded-full text-center focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGeneratePlan}
          className="w-60 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-[10px] rounded-full transition duration-300 shadow-lg hover:scale-105"
        >
          여행 계획하기
        </button>
      </div>

      {showResult && (
        <div className="w-[1200px] mt-12 mb-20">
          <div className="text-center text-white text-base mb-6">한국관광공사 TourAPI로 가져온 서울 지역 관광지입니다.</div>
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