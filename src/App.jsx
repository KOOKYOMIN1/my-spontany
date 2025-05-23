import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

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

    return () => unsubscribe(); // 컴포넌트 언마운트 시 리스너 제거
  }, []);

  return (
    <div className="App">
      <h1>Spontany ✈️</h1>
      {user ? (
        <p>안녕하세요, {user.displayName}님</p>
      ) : (
        <p>로그인 해주세요</p>
      )}
    </div>
  );
}

export default App;