// /api/create-toss-payment.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, amount, orderName } = 
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!userId || !amount || !orderName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const orderId = `${userId}-${Date.now()}`;

    // 🟡 your 도메인 부분 수정 필요 (배포용 주소로)
    const successUrl = "https://my-spontany.vercel.app/payment-success";
    const failUrl = "https://my-spontany.vercel.app/payment-fail";

    const response = await fetch("https://api.tosspayments.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.TOSS_SECRET_KEY + ":"
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        orderName,
        orderId,
        successUrl,
        failUrl,
        customerName: "Spontany 사용자",
        paymentMethod: "카드", // 생략 가능: Toss 창에서 선택됨
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Toss 결제 생성 실패:", data);
      return res.status(500).json({ error: "Toss payment creation failed", details: data });
    }

    return res.status(200).json({ paymentUrl: data.paymentUrl });
  } catch (error) {
    console.error("❌ 서버 오류:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}