import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveUserPlan = async (uid, planData) => {
  try {
    const planId = Date.now().toString();
    const ref = doc(db, "plans", uid, "entries", planId); // ✅ 수정됨
    await setDoc(ref, planData);
    console.log("✅ Firestore 저장 성공");
  } catch (error) {
    console.error("❌ Firestore 저장 실패:", error.message || error);
    throw error;
  }
};