import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { saveUserPlan } from "../utils/saveUserPlan";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

import "../index.css"; // ✅ Tailwind가 제대로 로드되지 않을 경우 추가 확인용

function Home() {
  const [departure, setDeparture] = useState("");
  const [budget, setBudget] = useState("");
  const [mood, setMood] = useState("");
  const [isWithCompanion, setIsWithCompanion] = useState(false);
  const [travelType, setTravelType] = useState("국내");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("로그인 후 이용해주세요");
      return;
    }
    if (!departure || !budget || !mood || !startDate || !endDate) {
      alert("모든 값을 입력해주세요");
      return;
    }

    const planData = {
      departure,
      budget,
      mood,
      withCompanion: isWithCompanion,
      travelType,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      timestamp: new Date(),
    };

    const newPlanId = await saveUserPlan(user.uid, planData);
    navigate(`/result?id=${newPlanId}`);
  };

  const moodColors = {
    기분전환: "bg-pink-500 hover:bg-pink-600",
    힐링: "bg-green-500 hover:bg-green-600",
    설렘: "bg-indigo-500 hover:bg-indigo-600",
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-start py-16 px-4"
      style={{
        backgroundImage: "url('/img/background.jpg')",
      }}
    >
      <div className="w-[1200px] bg-white rounded-[2rem] shadow-xl p-10 border border-gray-200 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          나만의 감성 여행 만들기
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="출발지를 입력하세요"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="w-full px-4 py-[10px] text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none"
            />
            <div className="flex gap-2">
              {["국내", "해외"].map((type, idx) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTravelType(type)}
                  className={`flex-1 px-3 py-[8px] rounded-full text-sm font-medium transition-all duration-200 shadow-md ${
                    travelType === type
                      ? "bg-yellow-600 text-white scale-105"
                      : idx === 0
                      ? "bg-orange-400 text-white hover:bg-orange-500"
                      : "bg-sky-400 text-white hover:bg-sky-500"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <input
            type="number"
            placeholder="예산 (₩)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-4 py-[10px] text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />

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
            minDate={startDate}
            locale={ko}
            dateFormat="yyyy년 MM월 dd일"
            placeholderText="돌아오는 날짜 선택"
            className="w-full px-4 py-[10px] text-sm border border-gray-200 bg-gray-50 rounded-full text-center focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {["기분전환", "힐링", "설렘"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setMood(label)}
              className={`w-32 px-3 py-[8px] rounded-full text-sm font-medium text-white transition-all duration-200 shadow-md ${
                mood === label ? "scale-105" : ""
              } ${moodColors[label]}`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsWithCompanion(false)}
            className={`w-32 px-3 py-[8px] rounded-full text-sm font-medium transition-all duration-200 shadow-md ${
              !isWithCompanion
                ? "bg-teal-600 text-white scale-105"
                : "bg-teal-100 text-teal-800 hover:bg-teal-200"
            }`}
          >
            혼자 여행
          </button>
          <button
            type="button"
            onClick={() => setIsWithCompanion(true)}
            className={`w-32 px-3 py-[8px] rounded-full text-sm font-medium transition-all duration-200 shadow-md ${
              isWithCompanion
                ? "bg-rose-500 text-white scale-105"
                : "bg-rose-100 text-rose-800 hover:bg-rose-200"
            }`}
          >
            동행 있음
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="w-60 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-[10px] rounded-full transition duration-300 shadow-lg hover:scale-105"
          >
            AI 추천 검색
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
