import { useState } from "react";

const imageData = {
  paris: {
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1584367367094-891042d6f60d?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1543340713-8eb064c4e0f1?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&h=600",
    ],
    quote: "에펠탑 아래에서 인생의 여유를 느껴보세요.",
  },
  tokyo: {
    images: [
      "https://images.unsplash.com/photo-1565084888274-294a9c5f81ae?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1589684071423-788c8f1b2b3d?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1557720574-1d97d6ae2c9f?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1526483360412-f211f5aab46d?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=800&h=600",
    ],
    quote: "네온빛 속 도쿄에서 나만의 순간을 찾아보세요.",
  },
  seoul: {
    images: [
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1583051941997-eb5fe9fd77da?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1622462912803-5d5b4b9ea5ed?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1582738412064-3e6b9c83bdfd?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1612254607521-5f6b91dc6e00?auto=format&fit=crop&w=800&h=600",
    ],
    quote: "서울의 리듬 속에서 나를 다시 마주해요.",
  },
  bali: {
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1529565213075-4ca436a5f6ce?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1549887534-4b7c4b3d8b6b?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1580966112807-6cc73f517f5c?auto=format&fit=crop&w=800&h=600",
    ],
    quote: "파도와 노을이 기다리는 발리에서 쉼을 느껴보세요.",
  },
  rome: {
    images: [
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1582452979932-77b14c2bcb87?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1545912453-8b02eebd3f2a?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1535392432937-a27c8eaa5236?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1593529467220-346147c93d5f?auto=format&fit=crop&w=800&h=600",
    ],
    quote: "고대의 숨결이 살아 숨 쉬는 로마, 감동의 여운을 남겨요.",
  },
  newyork: {
    images: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1523978591478-c753949ff840?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1508051123996-69f8caf4891c?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1531177071272-8c2c79c1d7aa?auto=format&fit=crop&w=800&h=600",
    ],
    quote: "모든 것이 가능한 도시, 뉴욕에서 새로운 나를 만나세요.",
  },
};

export default function DestinationPhotoViewer() {
  const [destination, setDestination] = useState("paris");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🖼️ 여행지 사진 미리보기</h2>

      <select
        className="mb-4 p-2 border rounded w-full"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      >
        {Object.keys(imageData).map((place) => (
          <option key={place} value={place}>
            {place.charAt(0).toUpperCase() + place.slice(1)}
          </option>
        ))}
      </select>

      <p className="mb-6 italic text-center text-gray-600 text-lg">
        {imageData[destination].quote}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imageData[destination].images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`${destination}-${idx}`}
            className="w-full h-48 object-cover rounded-xl shadow-md"
          />
        ))}
      </div>
    </div>
  );
}