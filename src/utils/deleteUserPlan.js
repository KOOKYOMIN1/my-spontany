import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export const deleteUserPlan = async (uid, planId) => {
  try {
    const ref = doc(db, "plans", uid, "entries", planId);
    await deleteDoc(ref);
    console.log("✅ 삭제 완료:", planId);
  } catch (error) {
    console.error("❌ 삭제 실패:", error);
  }
};