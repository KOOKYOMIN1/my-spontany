// ✅ /pages/api/toss-webhook.js (Toss 웹훅 처리용 API, Vercel 배포용)

import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method Not Allowed" });
}

try {
const { orderId, status, paymentKey } = req.body;

php
복사
편집
if (status !== "DONE") {
  console.log("❌ 결제 미완료 상태입니다:", status);
  return res.status(200).json({ received: true });
}

// orderId 예: "user123-1723500923"
const userId = orderId?.split("-")[0];
if (!userId) {
  return res.status(400).json({ error: "Invalid orderId" });
}

// Firestore에서 유저 프리미엄 정보 업데이트
await updateDoc(doc(db, "users", userId), {
  isPremium: true,
  premiumViaWebhook: true,
  premiumUntil: "2025-07-31", // TODO: 만료일 자동 계산 가능
  lastPaymentKey: paymentKey,
});

console.log("✅ 프리미엄 적용 완료:", userId);
return res.status(200).json({ success: true });
} catch (err) {
console.error("❌ 웹훅 처리 실패:", err);
return res.status(500).json({ error: "Internal Server Error" });
}
}