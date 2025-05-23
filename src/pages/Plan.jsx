import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginButton from '../components/LoginButton';

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

  const handleSubmit = () => {
    const params = new URLSearchParams({
      departure,
      budget,
      mood,
      companion: isWithCompanion,
    });
    navigate(`/result?${params.toString()}`);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Spontany 여행 계획하기</h1>

      <LoginButton />

      <label className="block mb-2">출발지:</label>
      <input
        type="text"
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
        placeholder="예: Seoul"
        className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <label className="block mb-2">여행 기간:</label>
      <input
        type="text"
        placeholder="예: 2025-06-01 ~ 06-04"
        className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <label className="block mb-2">예산 (₩):</label>
      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="₩ 1000000"
        className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <label className="block mb-2">감정 선택:</label>
      <div className="flex gap-3 mb-6">
        {emotions.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => setMood(label)}
            className={`px-4 py-2 rounded-full border transition-all duration-200
              ${mood === label
                ? 'bg-blue-500 text-white border-blue-500 shadow-md scale-105'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      <label className="block mb-2">동행 찾기:</label>
      <label className="flex items-center mb-6">
        <input
          type="checkbox"
          checked={isWithCompanion}
          onChange={(e) => setIsWithCompanion(e.target.checked)}
          className="mr-2"
        />
        {isWithCompanion ? '동행' : '혼자'}
      </label>

      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition"
      >
        ✨ 즉흥 여행 생성하기
      </button>
    </div>
  )
}

export default Plan