import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header"; // ✅ 공통 헤더
import Plan from "./pages/Plan";
import Result from "./pages/Result";
import History from "./pages/History";
import LoginButton from "./components/LoginButton";

function App() {
  const [user, setUser] = useState(undefined); // 처음엔 undefined로 설정

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
      <Header user={user} /> {/* ✅ 모든 페이지에 공통 표시 */}

      <div className="App text-center px-4 pb-10">
        <Routes>
          <Route path="/" element={user ? <Plan /> : <LoginButton />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={user ? <History /> : <LoginButton />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;