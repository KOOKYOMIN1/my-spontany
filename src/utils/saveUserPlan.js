import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * 사용자의 여행 계획을 Firestore에 저장합니다.
 * 저장 경로: /plans/{uid}/entries/{planId}
 * @param {string} uid - Firebase Auth 유저 UID
 * @param {object} planData - 여행 계획 데이터 (departure, budget 등)
 */
export const saveUserPlan = async (uid, planData) => {
  try {
    const planId = Date.now().toString(); // 고유 ID로 타임스탬프 사용
    const userDocRef = doc(db, "plans", uid);
    const entryRef = doc(collection(userDocRef, "entries"), planId);

    await setDoc(entryRef, planData);
    console.log("✅ Firestore 저장 성공");
  } catch (error) {
    console.error("❌ Firestore 저장 실패:", error.message || error);
  }
};