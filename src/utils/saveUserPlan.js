// src/utils/saveUserPlan.js

import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveUserPlan = async (uid, planData) => {
  try {
    const planId = Date.now().toString(); // 고유한 timestamp 기반 ID
    const ref = doc(collection(doc(db, "plans", uid), "entries"), planId);
    await setDoc(ref, planData);
    console.log("✅ Firestore 저장 성공");
  } catch (error) {
    console.error("❌ Firestore 저장 실패:", error);
  }
};