import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Share() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const [userId, entryId] = id.split('-');
        if (!userId || !entryId) throw new Error('잘못된 링크');

        const ref = doc(db, 'plans', userId, 'entries', entryId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setPlan(snap.data());
        }
      } catch (err) {
        console.error('공유 페이지 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center text-gray-500 animate-pulse">✈️ 여행 계획을 불러오는 중입니다...</div>;
  }

  if (!plan) {
    return <div className="p-10 text-center text-red-500">❌ 계획을 찾을 수 없습니다.</div>;
  }

  // 도시 매핑 (감정 기반 추천)
  const emotionToCityMap = {
    기분전환: { city: "Bangkok", message: "바쁜 일상 속, 방콕에서 활력을 찾아보세요 🌇" },
    힐링: { city: "Bali", message: "발리의 따뜻한 바람이 당신을 감싸줄 거예요 🌴" },
    설렘: { city: "Paris", message: "파리의 밤, 에펠탑 아래 당신의 마음이 두근거릴 거예요 💘" },
  };

  const selected = emotionToCityMap[plan.mood] || {
    city: "오사카",
    message: "오사카에서 맛있는 음식과 힐링을 동시에 즐겨보세요 🍜",
  };

  return (
    <div className="p-8 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">📤 친구의 감성 여행 계획</h1>

      <div className="bg-white border border-indigo-100 shadow-xl rounded-2xl p-6 space-y-4">
        <div className="text-left space-y-1">
          <p><strong>출발지:</strong> {plan.departure}</p>
          <p><strong>예산:</strong> ₩{plan.budget}</p>
          <p><strong>감정:</strong> {plan.mood}</p>
          <p><strong>동행:</strong> {plan.withCompanion ? "동행" : "혼자"}</p>
        </div>

        <hr />

        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-green-700">✨ 추천 여행지: {selected.city}</h2>
          <p className="text-gray-600 italic">{selected.message}</p>

          <img
            src={`https://source.unsplash.com/featured/600x400/?${selected.city}`}
            alt={selected.city}
            className="w-full h-64 object-cover rounded-xl shadow-lg mt-4"
          />
        </div>
      </div>

      <p className="mt-10 text-sm text-gray-400">© Spontany 공유 링크 - 나만의 감정 여행을 친구와 함께 ✈️</p>
    </div>
  );
}