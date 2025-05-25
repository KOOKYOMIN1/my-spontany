import { useState } from "react";

function FlightSearch({ originCity, destinationCity }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFlights = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://kiwi-com-cheap-flights.p.rapidapi.com/search-flights?fly_from=${originCity}&fly_to=${destinationCity}&date_from=${getDate(7)}&date_to=${getDate(7)}&curr=KRW`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_KIWI_API_KEY,
            "X-RapidAPI-Host": "kiwi-com-cheap-flights.p.rapidapi.com",
          },
        }
      );

      const data = await res.json();
      setFlights(data.data || []);
    } catch (err) {
      console.error("Kiwi API 호출 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="mt-12 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-blue-600 mb-4">🛫 항공권 검색</h2>
      <p className="text-sm text-gray-500 mb-2">
        {originCity} → {destinationCity} / 출발: {getDate(7)}
      </p>
      <button
        onClick={searchFlights}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
         항공권 검색하기
      </button>

      {loading && <p className="text-gray-500">불러오는 중...</p>}

      {flights.length > 0 && (
        <ul className="space-y-4 text-left">
          {flights.slice(0, 5).map((f, idx) => (
            <li key={idx} className="border p-4 rounded-xl shadow-sm">
              <p><strong>항공사:</strong> {f.airlines?.[0] || "확인 불가"}</p>
              <p><strong>가격:</strong> ₩{f.price?.toLocaleString() || "없음"}</p>
              <p><strong>출발:</strong> {new Date(f.dTimeUTC * 1000).toLocaleString()}</p>
              <p><strong>도착:</strong> {new Date(f.aTimeUTC * 1000).toLocaleString()}</p>
              <a
                href={f.deep_link}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 bg-indigo-500 text-white px-3 py-1 rounded"
              >
                예약하러 가기 →
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FlightSearch;