import { useEffect, useState } from 'react';

export default function Itinerary({ mood = '힐링', destination = '강릉', days = 3 }) {
  const [schedule, setSchedule] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getItinerary = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/generate-itinerary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mood, destination, days }),
        });
        const data = await res.json();
        setSchedule(data.text);
      } catch (e) {
        setSchedule('일정을 생성하지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    getItinerary();
  }, [mood, destination, days]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">🎒 GPT 추천 일정</h1>
      {loading ? (
        <p>일정을 생성 중입니다...</p>
      ) : (
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{schedule}</pre>
      )}
    </div>
  );
}