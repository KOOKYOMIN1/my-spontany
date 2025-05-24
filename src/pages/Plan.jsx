import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { saveUserPlan } from '../utils/saveUserPlan';
import LoginButton from '../components/LoginButton';
import DestinationPhotoViewer from '../components/DestinationPhotoViewer';

function Plan() {
  const [departure, setDeparture] = useState('');
  const [budget, setBudget] = useState('');
  const [mood, setMood] = useState('');
  const [isWithCompanion, setIsWithCompanion] = useState(false);

  const navigate = useNavigate();

  const emotions = [
    { label: '기분전환', emoji: '😐' },
    { label: '힐링', emoji: '😴' },
    { label: '설렘', emoji: '💘' },
  ];

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("로그인 후 이용해주세요");
      return;
    }

    if (!mood) {
      alert("감정을 선택해주세요 🧠");
      return;
    }

    if (!budget || Number(budget) < 1000) {
      alert("예산은 최소 ₩1,000 이상 입력해야 합니다.");
      return;
    }

    const planData = {
      departure,
      budget: Number(budget),
      mood,
      withCompanion: Boolean(isWithCompanion),
      timestamp: Date.now(),
    };

    const entryId = await saveUserPlan(user.uid, planData);
    const planId = `${user.uid}-${entryId}`;

    const params = new URLSearchParams({
      departure,
      budget,
      mood,
      withCompanion: isWithCompanion,
    });

    navigate(`/result?${params.toString()}&planId=${planId}`);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        ✈️ Spontany 여행 계획하기
      </h1>

      <LoginButton />

      {/* 출발지 */}
      <label className="block mb-2 mt-6">출발지:</label>
      <input
        type="text"
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
        placeholder="예: Seoul"
        className="border border-gray-300 p-2 rounded w-full mb-4"
      />

      {/* 예산 */}
      <label className="block mb-2">예산 (₩):</label>
      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="₩ 1000000"
        className="border border-gray-300 p-2 rounded w-full mb-4"
      />

      {/* 감정 */}
      <label className="block mb-2">감정 선택:</label>
      <div className="flex gap-3 mb-4">
        {emotions.map(({ label, emoji }) => (
          <button
            key={label}
            type="button"
            onClick={() => setMood(label)}
            className={`px-4 py-2 rounded-full border transition-all duration-200 ${
              mood === label
                ? 'bg-blue-500 text-white border-blue-500 shadow-md scale-105'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* 동행 여부 버튼 */}
      <label className="block mt-6 mb-2">동행 여부:</label>
      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={() => setIsWithCompanion(false)}
          className={`px-4 py-2 rounded-full border transition-all duration-200 ${
            !isWithCompanion
              ? 'bg-blue-500 text-white border-blue-500 shadow-md scale-105'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
          }`}
        >
          혼자
        </button>
        <button
          type="button"
          onClick={() => setIsWithCompanion(true)}
          className={`px-4 py-2 rounded-full border transition-all duration-200 ${
            isWithCompanion
              ? 'bg-blue-500 text-white border-blue-500 shadow-md scale-105'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
          }`}
        >
          동행
        </button>
      </div>

      {/* 버튼 */}
      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition"
      >
        ✨ 즉흥 여행 생성하기
      </button>

      <div className="mt-12">
        <DestinationPhotoViewer />
      </div>
    </div>
  );
}

export default Plan;