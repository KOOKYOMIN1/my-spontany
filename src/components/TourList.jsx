import { useEffect, useState } from "react";

function TourList({ areaCode = 1 }) {
  const [spots, setSpots] = useState([]);
  const serviceKey = import.meta.env.VITE_TOURAPI_KEY;

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=spontany&arrange=O&contentTypeId=12&areaCode=${areaCode}&_type=json`;
        
        console.log("✅ 요청 URL:", url);

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP 오류: ${res.status}`);
        }

        const json = await res.json();
        const items = json?.response?.body?.items?.item;

        if (!items) {
          console.warn("⚠️ 데이터가 비어있습니다:", json);
        }

        setSpots(items || []);
      } catch (err) {
        console.error("❌ 관광지 불러오기 실패:", err);
      }
    };

    fetchTourData();
  }, [areaCode]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 max-w-[1200px] mx-auto">
      {spots.length === 0 && (
        <p className="col-span-3 text-center text-white font-medium">
          관광지를 불러오는 중이거나 데이터가 없습니다.
        </p>
      )}
      {spots.map((spot) => (
        <div
          key={spot.contentid}
          className="bg-white shadow-xl rounded-2xl overflow-hidden transition-transform hover:scale-105"
        >
          <img
            src={spot.firstimage || "https://via.placeholder.com/400x250?text=No+Image"}
            alt={spot.title}
            className="w-full h-[200px] object-cover"
          />
          <div className="p-4 text-left">
            <h3 className="text-xl font-semibold">{spot.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{spot.addr1}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TourList;