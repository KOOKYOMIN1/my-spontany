import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { deleteUserPlan } from '../utils/deleteUserPlan';

function History() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const entriesRef = collection(db, 'plans', user.uid, 'entries');
      const snapshot = await getDocs(entriesRef);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 최신순 정렬
      data.sort((a, b) => b.timestamp - a.timestamp);

      setEntries(data);
    } catch (error) {
      console.error('❌ 여행 기록 불러오기 실패:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId) => {
    const user = auth.currentUser;
    if (!user) return;

    const confirm = window.confirm('정말 삭제하시겠습니까?');
    if (!confirm) return;

    try {
      await deleteUserPlan(user.uid, entryId);
      setEntries(entries.filter(e => e.id !== entryId));
    } catch (error) {
      alert('삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">📂 나의 여행 히스토리</h1>

      {loading ? (
        <p>불러오는 중...</p>
      ) : entries.length === 0 ? (
        <p>저장된 여행 기록이 없습니다.</p>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white shadow-md rounded-xl p-4 text-left relative">
              <p className="text-sm text-gray-500">
                🕒 {new Date(entry.timestamp).toLocaleString()}
              </p>
              <p className="mt-2"><strong>감정:</strong> {entry.mood}</p>
              <p><strong>출발지:</strong> {entry.departure}</p>
              <p><strong>예산:</strong> ₩{entry.budget.toLocaleString()}</p>
              <p><strong>동행:</strong> {entry.withCompanion ? '동행 있음' : '혼자 여행'}</p>

              <button
                onClick={() => handleDelete(entry.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                🗑 삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;