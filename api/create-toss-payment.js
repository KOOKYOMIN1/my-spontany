// /api/create-toss-payment.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, amount, orderName } = req.body;

    if (!userId || !amount || !orderName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Toss Payments 연동
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
        orderId: `${userId}-${Date.now()}`,
        successUrl: "https://your-spontany.vercel.app/payment-success",
        failUrl: "https://your-spontany.vercel.app/payment-fail",
        customerName: "Spontany 사용자",
        paymentMethod: "카드", // 생략 시 결제창에서 선택
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Toss 결제 생성 실패:", data);
      return res.status(500).json({ error: "Toss payment creation failed" });
    }

    return res.status(200).json({ paymentUrl: data.paymentUrl });
  } catch (error) {
    console.error("❌ 서버 오류:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}