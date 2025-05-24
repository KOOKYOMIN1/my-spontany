// ✅ 1. /plan 감성화 Plan.jsx
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
    if (!user) return alert("로그인 후 이용해주세요");

    const planId = await saveUserPlan(user.uid, {
      departure,
      budget,
      mood,
      withCompanion: isWithCompanion,
      timestamp: new Date(),
    });

    navigate(`/result?departure=${departure}&budget=${budget}&mood=${mood}&withCompanion=${isWithCompanion}&planId=${planId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">✨ 여행 계획하기</h1>

        <div className="space-y-4">
          <input type="text" placeholder="출발지 (예: Seoul)"
            value={departure} onChange={(e) => setDeparture(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <input type="number" placeholder="예산 (예: 500000)"
            value={budget} onChange={(e) => setBudget(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <div className="space-y-2">
            <p className="text-gray-700 font-semibold">지금 기분은?</p>
            <div className="flex gap-3">
              {emotions.map((e) => (
                <button key={e.label} onClick={() => setMood(e.label)}
                  className={`px-4 py-2 rounded-xl border ${mood === e.label ? 'bg-pink-500 text-white' : 'bg-white text-gray-700'} transition shadow`}
                >{e.emoji} {e.label}</button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-gray-700">
            <input type="checkbox" checked={isWithCompanion} onChange={() => setIsWithCompanion(!isWithCompanion)} />
            친구와 함께 떠날래요!
          </label>

          <button onClick={handleSubmit}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl shadow-xl transition">
            ✈️ 여행 추천 받기
          </button>
        </div>

        <div className="pt-6">
          <LoginButton />
        </div>

        <DestinationPhotoViewer />
      </div>
    </div>
  );
}

export default Plan;
