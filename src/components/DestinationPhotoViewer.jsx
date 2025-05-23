import { useState } from "react";

const imageUrls = {
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  tokyo: "https://images.unsplash.com/photo-1584337902624-a3d1c1aa622d",
  newyork: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
  london: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba",
  sydney: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d6",
  seoul: "https://images.unsplash.com/photo-1575936123452-b67c3203c357",
  bali: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  rome: "https://images.unsplash.com/photo-1517976487492-5750f3195933",
};

export default function DestinationPhotoViewer() {
  const [destination, setDestination] = useState("paris");

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🌍 여행지 사진 미리보기</h2>

      <select
        className="mb-4 p-2 border rounded w-full"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      >
        {Object.keys(imageUrls).map((place) => (
          <option key={place} value={place}>
            {place.charAt(0).toUpperCase() + place.slice(1)}
          </option>
        ))}
      </select>

      <div className="w-full h-72 overflow-hidden rounded-xl shadow-lg border">
        <img
          src={imageUrls[destination]}
          alt={destination}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}