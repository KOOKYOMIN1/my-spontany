import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function LoginButton() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Firestore에 유저 저장
      const userRef = doc(db, "users", user.uid); // users 컬렉션, 문서 ID는 uid
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date()
      });

      console.log("유저 정보 저장 완료!");
      alert(`환영합니다, ${user.displayName}님!`);

    } catch (error) {
      console.error("로그인 실패:", error.message);
      alert("로그인 중 오류 발생 😢");
    }
  };

  return (
    <button onClick={handleLogin} className="p-2 bg-blue-600 text-white rounded">
      Google 계정으로 로그인
    </button>
  );
}

export default LoginButton;