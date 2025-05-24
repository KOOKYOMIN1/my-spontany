import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getUserPlans = async (userId) => {
  try {
    const plansRef = collection(db, "plans");
    const q = query(plansRef, where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    const plans = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return plans;
  } catch (error) {
    console.error("❌ 히스토리 불러오기 실패:", error);
    return [];
  }
};