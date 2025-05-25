import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/beach.jpg')" }}>
      {/* 오른쪽 상단 로그인 버튼 */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogin}
          className="bg-white text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-100"
        >
          로그인
        </button>
      </div>

      {/* 가운데 메인 문구만 유지 */}
      <div className="flex flex-col justify-center items-center text-center h-screen px-4">
        <h1 className="text-4xl font-bold text-black mb-4">Spontany </h1>
        <p className="text-lg text-gray-700 mb-2">
          여행이 필요한 순간, 감정이 안내하는 방향으로 떠나요
        </p>
        <p className="text-sm text-gray-600">
          로그인하면 당신의 감정 기반 여행 히스토리를 저장해드려요.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;