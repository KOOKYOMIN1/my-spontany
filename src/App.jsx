import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Plan from "./pages/Plan";
import Result from "./pages/Result";
import History from "./pages/History";
import LoginPage from "./pages/LoginPage"; // ✅ 감성 로그인 페이지 추가

function App() {
  const [user, setUser] = useState(undefined); // 처음엔 undefined로 시작

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return <div className="text-center p-8">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-yellow-200">
      <Header user={user} /> {/* 모든 페이지 공통 헤더 */}

      <div className="App text-center px-4 pb-10">
        <Routes>
          <Route path="/" element={user ? <Plan /> : <LoginPage />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={user ? <History /> : <LoginPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;