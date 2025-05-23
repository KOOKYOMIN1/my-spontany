import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Plan from "./pages/Plan";
import Result from "./pages/Result";
import History from "./pages/History";
import LoginPage from "./pages/LoginPage";
import Statistics from "./pages/Statistics";
import Share from "./pages/Share"; // ✅ 공유 페이지 import 추가
import Home from "./pages/Home";

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
      <Header user={user} />

      <div className="App text-center px-4 pb-10">
        <Routes>
          <Route path="/" element={user ? <Plan /> : <Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={user ? <History /> : <LoginPage />} />
          <Route path="/statistics" element={user ? <Statistics /> : <LoginPage />} />
          <Route path="/share/:id" element={<Share />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;