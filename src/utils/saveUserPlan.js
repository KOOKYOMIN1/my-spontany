// src/utils/saveUserPlan.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveUserPlan = async (userId, planData) => {
  try {
    await setDoc(doc(db, "plans", userId), planData);
    console.log("✅ Firestore 저장 성공:", planData);
  } catch (error) {
    console.error("❌ Firestore 저장 실패:", error);
  }
};