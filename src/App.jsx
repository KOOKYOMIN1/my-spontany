import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Result from "./pages/Result";
import History from "./pages/History";
import LoginPage from "./pages/LoginPage";
import Statistics from "./pages/Statistics";
import Share from "./pages/Share";
import Home from "./pages/Home";

function App() {
  const [user, setUser] = useState(undefined);

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
    <>
      <Header user={user} />
      <div className="App text-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={user ? <History /> : <LoginPage />} />
          <Route path="/statistics" element={user ? <Statistics /> : <LoginPage />} />
          <Route path="/share/:id" element={<Share />} />
        </Routes>
      </div>
    </>
  );
}

export default App; // ✅ 이 줄이 반드시 필요!