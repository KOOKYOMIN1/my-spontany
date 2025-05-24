import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginPage() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg')" }}>
      <div className="bg-white bg-opacity-80 p-10 rounded-2xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Spontany</h1>
        <p className="mb-6 text-gray-600 italic">
          여행은 마음이 먼저 떠나는 연습이에요 ✈️
        </p>
        <button
          onClick={handleLogin}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md shadow transition"
        >
          Google 계정으로 로그인
        </button>
      </div>
    </div>
  );
}