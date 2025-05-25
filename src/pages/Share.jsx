// ✅ 2. /share/:id 공유 페이지 감성화 Share.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function Share() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, `plans/${id.split('-')[0]}/entries/${id.split('-')[1]}`);
      const snap = await getDoc(ref);
      if (snap.exists()) setData(snap.data());
    };
    fetchData();
  }, [id]);

  if (!data) return <p className="text-center mt-10 text-gray-500">불러오는 중입니다...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-6 space-y-5">
        <h1 className="text-2xl font-bold text-center text-gray-800"> 친구의 여행 추천</h1>

        <div className="text-center space-y-1">
          <p>  출발지: {data.departure}</p>
          <p>  예산: ₩{data.budget}</p>
          <p>  감정: {data.mood}</p>
          <p>  동행: {data.withCompanion ? "동행" : "혼자"}</p>
        </div>

        <p className="text-center text-sm text-gray-400">이 링크는 친구가 공유한 여행 계획이에요</p>
      </div>
    </div>
  );
}

export default Share;