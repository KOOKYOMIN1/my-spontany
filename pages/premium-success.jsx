import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function PremiumSuccess() {
  const router = useRouter();

  useEffect(() => {
    const confirmPremium = async (user) => {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          isPremium: true,
          premiumUntil: "2025-07-31",
        });
        alert("프리미엄 결제가 완료되었습니다 🎉");
        router.push("/");
      } catch (error) {
        console.error("❌ Firestore 업데이트 실패:", error);
        alert("프리미엄 처리 중 오류가 발생했습니다.");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) confirmPremium(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">결제 성공!</h1>
      <p className="text-gray-600">잠시 후 메인 화면으로 이동합니다...</p>
    </div>
  );
}