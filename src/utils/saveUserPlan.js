import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveUserPlan = async (uid, planData) => {
  try {
    const ref = doc(db, "plans", uid); // 🔥 user.uid를 문서 ID로
    await setDoc(ref, planData);
    console.log("✅ Firestore 저장 성공");
  } catch (error) {
    console.error("❌ Firestore 저장 실패:", error);
  }
};