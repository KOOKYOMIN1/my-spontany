// ✅ 감성 로그인 페이지 컴포넌트 v2: 자연 배경 + 감성 문장 + CTA 버튼
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
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center px-6"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')" }}
    >
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl text-center max-w-xl w-full space-y-6">
        <h1 className="text-5xl font-extrabold text-gray-800">Spontany ✈️</h1>
        <p className="text-lg text-gray-600 italic">
          여행이 필요한 순간, 감정이 안내하는 방향으로 떠나요 🌿
        </p>
        <button
          onClick={handleLogin}
          className="mt-4 bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition"
        >
          💙 Google로 로그인하고 여행 시작하기
        </button>
        <p className="text-sm text-gray-500">로그인하면 당신의 감정 기반 여행 히스토리를 저장해드려요.</p>
      </div>
    </div>
  );
}

export default LoginHero;
