import { useState } from "react";

const destinations = [
  "paris",
  "tokyo",
  "newyork",
  "london",
  "sydney",
  "seoul",
  "bali",
  "rome",
];

export default function DestinationPhotoViewer() {
  const [destination, setDestination] = useState("paris");

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🌍 여행지 사진 보기</h1>

      <select
        className="mb-6 p-2 border rounded w-full"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      >
        {destinations.map((place) => (
          <option key={place} value={place}>
            {place.charAt(0).toUpperCase() + place.slice(1)}
          </option>
        ))}
      </select>

      <div className="w-full h-72 overflow-hidden rounded-xl shadow-lg border">
        <img
          src={`https://source.unsplash.com/800x600/?${destination}`}
          alt={destination}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}