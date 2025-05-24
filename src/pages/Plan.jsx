// ✅ 감정 선택을 이모지 대신 Lucide 아이콘으로 리디자인한 Plan.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { saveUserPlan } from "../utils/saveUserPlan";
import LoginButton from "../components/LoginButton";
import DestinationPhotoViewer from "../components/DestinationPhotoViewer";

// lucide 아이콘
import { Leaf, Moon, Sparkles } from "lucide-react";

function Plan() {
  const [departure, setDeparture] = useState("");
  const [budget, setBudget] = useState("");
  const [mood, setMood] = useState("");
  const [isWithCompanion, setIsWithCompanion] = useState(false);
  const navigate = useNavigate();

  const emotions = [
    { label: "기분전환", icon: <Leaf className="w-5 h-5 text-green-500" /> },
    { label: "힐링", icon: <Moon className="w-5 h-5 text-indigo-500" /> },
    { label: "설렘", icon: <Sparkles className="w-5 h-5 text-pink-500" /> },
  ];

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const planId = await saveUserPlan({
      user,
      departure,
      budget,
      mood,
      withCompanion: isWithCompanion,
    });

    navigate(`/result?departure=${departure}&budget=${budget}&mood=${mood}&withCompanion=${isWithCompanion}&planId=${planId}`);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">나만의 감성 여행 만들기</h1>

      <div className="space-y-4">
        <label className="block text-gray-700 font-medium">출발지</label>
        <input
          type="text"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          placeholder="예: Seoul"
          className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
        />

        <label className="block text-gray-700 font-medium">예산 (₩)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="예: 500000"
          className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
        />

        <label className="block text-gray-700 font-medium">감정 선택</label>
        <div className="flex gap-3">
          {emotions.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setMood(label)}
              className={`flex items-center gap-1 px-4 py-2 border rounded-full shadow-sm transition text-sm ${
                mood === label ? "bg-blue-100 border-blue-300" : "bg-white border-gray-300"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <label className="block text-gray-700 font-medium mt-4">동행 여부</label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isWithCompanion}
            onChange={(e) => setIsWithCompanion(e.target.checked)}
          />
          <span>누군가와 함께 떠나요</span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl shadow"
      >
        ✨ 여행 추천받기
      </button>

      <DestinationPhotoViewer city={departure} />
      <LoginButton />
    </div>
  );
}

export default Plan;
