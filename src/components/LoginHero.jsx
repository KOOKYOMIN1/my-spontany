// ✅ 감성 로그인 페이지 컴포넌트: components/LoginHero.jsx
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

function LoginHero() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert("로그인에 실패했어요. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 space-y-6 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Spontany ✈️</h1>
        <p className="text-lg text-gray-600">여행이 필요할 땐, 감정으로 고르는 즉흥 여행</p>
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="감성 여행"
          className="w-full h-56 object-cover rounded-2xl shadow-md"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg py-3 px-8 rounded-full shadow-lg transition"
        >
          💙 Google로 로그인하고 여행 떠나기
        </button>
        <p className="text-sm text-gray-400">로그인하면 나만의 여행 기록이 저장됩니다.</p>
      </div>
    </div>
  );
}

export default LoginHero;
