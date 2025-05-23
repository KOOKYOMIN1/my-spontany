import { useEffect, useState } from "react";

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export default function DestinationPhotoViewer() {
  const [destination, setDestination] = useState("paris");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const destinations = {
    paris: "에펠탑 아래에서 인생의 여유를 느껴보세요.",
    tokyo: "네온빛 속 도쿄에서 나만의 순간을 찾아보세요.",
    seoul: "서울의 리듬 속에서 나를 다시 마주해요.",
    bali: "파도와 노을이 기다리는 발리에서 쉼을 느껴보세요.",
    rome: "고대의 숨결이 살아 숨 쉬는 로마, 감동의 여운을 남겨요.",
    newyork: "모든 것이 가능한 도시, 뉴욕에서 새로운 나를 만나세요.",
  };

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.pexels.com/v1/search?query=${destination}&per_page=5`,
          {
            headers: {
              Authorization: PEXELS_API_KEY,
            },
          }
        );
        const data = await res.json();
        setImages(data.photos.map((photo) => photo.src.landscape));
      } catch (error) {
        console.error("이미지 불러오기 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [destination]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🖼️ 여행지 사진 미리보기</h2>

      <select
        className="mb-4 p-2 border rounded w-full"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      >
        {Object.keys(destinations).map((city) => (
          <option key={city} value={city}>
            {city.charAt(0).toUpperCase() + city.slice(1)}
          </option>
        ))}
      </select>

      <p className="mb-6 italic text-center text-gray-600 text-lg">
        {destinations[destination]}
      </p>

      {loading ? (
        <p className="text-center text-gray-500">사진 불러오는 중...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`${destination}-${idx}`}
              className="w-full h-48 object-cover rounded-xl shadow-md"
            />
          ))}
        </div>
      )}
    </div>
  );
}