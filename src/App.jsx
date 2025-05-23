import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Spontany ✈️</h1>

      {user ? (
        <>
          <p className="mb-2">안녕하세요, <strong>{user.displayName}</strong>님</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            로그아웃
          </button>
        </>
      ) : (
        <p>로그인 해주세요</p>
      )}
    </div>
  );
}

export default App;