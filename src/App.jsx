import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import LoginButton from "./components/LoginButton";
import Plan from "./pages/Plan"; // Plan.jsx 위치에 맞게 경로 수정

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        console.log("✅ 로그인 유지됨:", firebaseUser.email);
      } else {
        setUser(null);
        console.log("🚪 로그아웃 상태");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("👋 로그아웃 성공");
    } catch (error) {
      console.error("❌ 로그아웃 실패:", error);
    }
  };

  return (
    <div className="App text-center p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4 flex justify-center items-center gap-2">
        Spontany ✈️
      </h1>

      {user ? (
        <>
          <p className="mb-2">
            안녕하세요, <strong>{user.displayName}</strong>님
          </p>

          {/* 🔥 여행 생성 폼 보여주기 */}
          <div className="mt-6">
            <Plan />
          </div>

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <p className="mb-4">로그인 해주세요</p>
          <LoginButton />
          <p className="mt-4 text-gray-500 text-sm">
            감정 기반 즉흥 여행을 추천해드립니다 ✨
          </p>
        </>
      )}
    </div>
  );
}

export default App;