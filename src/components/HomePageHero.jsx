import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HomePageHero() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center px-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')",
      }}
    >
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl text-center max-w-2xl w-full space-y-6">
        <h1 className="text-5xl font-extrabold text-gray-800">Spontany ✈️</h1>
        <p className="text-lg text-gray-600 italic">
          기분이 이끄는 여행, 지금 떠나보세요 🌿<br />
          당신의 감정과 예산에 맞는 완벽한 여행을 추천해드려요.
        </p>

        {user ? (
          <button
            onClick={() => navigate("/plan")}
            className="mt-4 bg-gradient-to-r from-pink-400 to-yellow-400 hover:from-pink-500 hover:to-yellow-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition"
          >
            ✨ 지금 여행 계획하러 가기
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition"
          >
            💙 로그인하고 시작하기
          </button>
        )}

        <p className="text-sm text-gray-500">
          Spontany는 감정 기반 여행 추천 서비스입니다.
        </p>
      </div>
    </div>
  );
}
