import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Routes, Route } from "react-router-dom";

import LoginButton from "./components/LoginButton";
import Plan from "./pages/Plan";
import Result from "./pages/Result";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      console.log(firebaseUser ? `✅ 로그인 유지됨: ${firebaseUser.email}` : "🚪 로그아웃 상태");
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
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Spontany ✈️</h1>

      {user ? (
        <>
          <p className="mb-4">안녕하세요, <strong>{user.displayName}</strong>님</p>
          <button
            onClick={handleLogout}
            className="mb-6 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            로그아웃
          </button>

          {/* 🔀 라우팅 영역 */}
          <Routes>
            <Route path="/" element={<Plan />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </>
      ) : (
        <div className="login-card">
          <img
            src="https://source.unsplash.com/400x200/?travel,freedom"
            alt="여행 감성"
          />
          <h1>Spontany ✈️</h1>
          <p className="mb-4">지금 당신의 감정에 맞춘 여행을 추천해드립니다 ✨</p>
          <LoginButton />
        </div>
      )}
    </div>
  );
}

export default App;