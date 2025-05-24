import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Result() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const departure = query.get("departure");
  const budget = query.get("budget");
  const mood = query.get("mood");
  const companion = query.get("companion");

  const [imageUrl, setImageUrl] = useState("");

  const emotionToCityMap = {
    기분전환: { city: "Bangkok", message: "바쁜 일상 속, 방콕에서 활력을 찾아보세요 🌇" },
    힐링: { city: "Bali", message: "발리의 따뜻한 바람이 당신을 감싸줄 거예요 🌴" },
    설렘: { city: "Paris", message: "파리의 밤, 에펠탑 아래 당신의 마음이 두근거릴 거예요 💘" },
  };

  const selected = emotionToCityMap[mood] || {
    city: "오사카",
    message: "오사카에서 맛있는 음식과 힐링을 동시에 즐겨보세요 🍜🏯",
  };

  useEffect(() => {
    if (!selected.city) return;
    fetch(`https://api.pexels.com/v1/search?query=${selected.city}&per_page=1`, {
      headers: {
        Authorization: import.meta.env.VITE_PEXELS_API_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.photos?.length > 0) {
          setImageUrl(data.photos[0].src.large);
        }
      });
  }, [selected.city]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">✈️ 추천 여행지 결과</h1>
      <p><strong>출발지:</strong> {departure}</p>
      <p><strong>예산:</strong> ₩{budget}</p>
      <p><strong>감정:</strong> {mood}</p>
      <p><strong>동행:</strong> {companion === "true" ? "동행" : "혼자"}</p>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">🎉 추천 여행지는…</h2>
      <h3 className="text-lg font-bold text-green-700 mb-2">
        {selected.city}
      </h3>
      <p className="text-gray-700 mb-4">{selected.message}</p>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={selected.city}
          className="w-full h-64 object-cover rounded-2xl shadow"
        />
      )}
    </div>
  );
}

export default Result;