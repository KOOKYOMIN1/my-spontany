// src/utils/saveUserPlan.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveUserPlan = async (userId, planData) => {
  try {
    await addDoc(collection(db, "plans"), {
      userId, // ✅ 조회용 필드
      ...planData,
    });
    console.log("✅ Firestore 저장 성공:", planData);
  } catch (error) {
    console.error("❌ Firestore 저장 실패:", error);
  }
};