import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import DestinationPhotoViewer from '../components/DestinationPhotoViewer';

export default function Share() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const [userId, entryId] = id.split('-');
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

  if (loading) return <div className="p-8 text-center">불러오는 중...</div>;
  if (!plan) return <div className="p-8 text-center">계획을 찾을 수 없습니다.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4 text-center">
      <h1 className="text-2xl font-bold">✨ 감성 여행 공유 ✨</h1>
      <p>출발지: {plan.departure}</p>
      <p>예산: {plan.budget}</p>
      <p>감정: {plan.mood}</p>
      <p>동행 여부: {plan.withCompanion ? '함께' : '혼자'}</p>
      <DestinationPhotoViewer mood={plan.mood} />
    </div>
  );
}