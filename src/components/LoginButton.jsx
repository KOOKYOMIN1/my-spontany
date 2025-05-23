// src/components/LoginButton.jsx

import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function LoginButton() {
  const [user, setUser] = useState(null);

  // 🔄 로그인 유지 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ 로그인
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Firestore에 유저 정보 저장
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      }, { merge: true });

      alert(`환영합니다, ${user.displayName}님!`);
    } catch (error) {
      console.error("로그인 실패:", error.message);
      alert("로그인 중 오류 발생 😢");
    }
  };

  // 🔓 로그아웃
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("로그아웃 되었습니다 👋");
    } catch (error) {
      console.error("로그아웃 실패:", error.message);
    }
  };

  return (
    <div className="mb-4 flex items-center justify-between">
      {user ? (
        <>
          <div className="flex items-center gap-2">
            <img src={user.photoURL} alt="profile" className="w-8 h-8 rounded-full" />
            <span className="text-sm text-gray-700">{user.displayName} 님</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-300 hover:bg-gray-400 text-sm px-3 py-1 rounded"
          >
            로그아웃
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Google 계정으로 로그인
        </button>
      )}
    </div>
  );
}