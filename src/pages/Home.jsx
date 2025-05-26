import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { saveUserPlan } from "../utils/saveUserPlan";

function Home() {
  const [departure, setDeparture] = useState("");
  const [budget, setBudget] = useState("");
  const [mood, setMood] = useState("");
  const [isWithCompanion, setIsWithCompanion] = useState(false);
  const [travelType, setTravelType] = useState("국내"); // ✨ 국내 / 해외 선택

  const navigate = useNavigate();
  const emotions = ["기분전환", "힐링", "설렘"];

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("로그인 후 이용해주세요");
      return;
    }
    if (!departure || !budget || !mood) {
      alert("모든 값을 입력해주세요");
      return;
    }

    const planData = {
      departure,
      budget,
      mood,
      withCompanion: isWithCompanion,
      travelType,
      timestamp: new Date(),
    };

    const newPlanId = await saveUserPlan(user.uid, planData);
    navigate(`/result?id=${newPlanId}`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-start py-16 px-4"
      style={{
        backgroundImage: "url('/img/background.jpg')",
      }}
    >
      <div className="w-[1200px] bg-white rounded-[2rem] shadow-xl p-10 border border-gray-300">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          나만의 감성 여행 만들기
        </h1>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <input
            type="text"
            placeholder="출발지를 입력하세요"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="w-64 px-4 py-[10px] text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
          <input
            type="number"
            placeholder="예산 (₩)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-64 px-4 py-[10px] text-sm border border-gray-200 bg-gray-50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {emotions.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setMood(label)}
              className={`px-4 py-[10px] rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${
                mood === label
                  ? "bg-yellow-600 text-white scale-105"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              }`}
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setIsWithCompanion(false)}
            className={`px-4 py-[10px] rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${
              !isWithCompanion
                ? "bg-yellow-600 text-white scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            혼자 여행
          </button>

          <button
            type="button"
            onClick={() => setIsWithCompanion(true)}
            className={`px-4 py-[10px] rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${
              isWithCompanion
                ? "bg-yellow-600 text-white scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            동행 있음
          </button>
        </div>

        {/* ✨ 국내 / 해외 선택 영역 */}
        <div className="flex justify-center gap-2 mt-4">
          {["국내", "해외"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTravelType(type)}
              className={`px-4 py-[10px] rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${
                travelType === type
                  ? "bg-yellow-600 text-white scale-105"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="w-60 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-[10px] rounded-full transition duration-200 shadow-md"
          >
            AI 추천 검색
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;