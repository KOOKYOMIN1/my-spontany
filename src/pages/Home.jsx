import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { saveUserPlan } from "../utils/saveUserPlan";
import LoginButton from "../components/LoginButton";
import DestinationPhotoViewer from "../components/DestinationPhotoViewer";

function Home() {
  const [departure, setDeparture] = useState("");
  const [budget, setBudget] = useState("");
  const [mood, setMood] = useState("");
  const [isWithCompanion, setIsWithCompanion] = useState(false);

  const navigate = useNavigate();

  const emotions = [
    { label: "기분전환"},
    { label: "힐링"},
    { label: "설렘"},
  ];

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
      timestamp: new Date(),
    };

    const newPlanId = await saveUserPlan(user.uid, planData);
    navigate(`/result?id=${newPlanId}`);
  };

  return (
    <div className="max-w-xl mx-auto text-left mt-10">
      <h1 className="text-3xl font-bold mb-4">나만의 감성 여행 만들기</h1>

      <label className="block mt-4">
        출발지:
        <input
          type="text"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          className="w-full mt-1 p-2 rounded border"
        />
      </label>

      <label className="block mt-4">
        예산 (₩):
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full mt-1 p-2 rounded border"
        />
      </label>

      <label className="block mt-4">
        감정 선택:
        <div className="flex space-x-2 mt-2">
          {emotions.map((e) => (
            <button
              key={e.label}
              className={`px-3 py-2 rounded border ${
                mood === e.label ? "bg-yellow-300" : ""
              }`}
              onClick={() => setMood(e.label)}
            >
              {e.emoji} {e.label}
            </button>
          ))}
        </div>
      </label>

      <label className="block mt-4">
        함께 가는 사람이 있나요?
        <input
          type="checkbox"
          checked={isWithCompanion}
          onChange={(e) => setIsWithCompanion(e.target.checked)}
          className="ml-2"
        />
      </label>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
      >
         즉흥 여행 생성기
      </button>

      <DestinationPhotoViewer mood={mood} />
    </div>
  );
}

export default Home;