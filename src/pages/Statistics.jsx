import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import MoodChart from '../components/MoodChart';

function Statistics() {
  const [moodCounts, setMoodCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserMoods = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const entriesRef = collection(db, 'plans', user.uid, 'entries');
        const snapshot = await getDocs(entriesRef);

        const moodFrequency = {};
        snapshot.forEach(doc => {
          const mood = doc.data().mood;
          if (mood) {
            moodFrequency[mood] = (moodFrequency[mood] || 0) + 1;
          }
        });

        console.log("moodCounts:", moodFrequency);
        setMoodCounts(moodFrequency);
      } catch (error) {
        console.error('감정 통계 불러오기 실패:', error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMoods();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4"> 나의 감정별 여행 통계</h1>
      {!loading && Object.keys(moodCounts).length > 0 ? (
        <MoodChart data={moodCounts} />
      ) : (
        !loading && <p className="text-gray-500"> 아직 저장된 감정 데이터가 없습니다.</p>
      )}
    </div>
  );
}

export default Statistics;