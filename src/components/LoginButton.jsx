import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

function LoginButton() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("로그인 성공:", user.displayName, user.email);
      alert(`환영합니다, ${user.displayName}님!`);
    } catch (error) {
      console.error("로그인 실패:", error.message);
      alert("로그인 중 오류가 발생했어요.");
    }
  };

  return (
    <button onClick={handleLogin} className="p-2 bg-blue-600 text-white rounded">
      Google 계정으로 로그인
    </button>
  );
}

export default LoginButton;