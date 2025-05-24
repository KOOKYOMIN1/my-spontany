// ✅ 3. 로그인 UI 감성화 LoginButton.jsx
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

function LoginButton() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert("로그인에 실패했어요 🙁");
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleLogin}
        className="bg-white border border-gray-300 hover:border-gray-500 text-gray-700 font-semibold py-2 px-5 rounded-full shadow-sm hover:shadow-md transition"
      >
        🟢 Google로 로그인
      </button>
    </div>
  );
}

export default LoginButton;
