export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, amount, orderName } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    console.log("✅ 결제 요청 수신:", { userId, amount, orderName });

    // 필수 필드 확인
    if (!userId || !amount || !orderName) {
      console.error("❌ 필수 정보 누락:", { userId, amount, orderName });
      return res.status(400).json({ error: "Missing required fields" });
    }

    const encodedSecretKey = Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString("base64");

    const tossRes = await fetch("https://api.tosspayments.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        orderName,
        orderId: `${userId}-${Date.now()}`,
        successUrl: "https://my-spontany.vercel.app/payment-success", // ✅ 수정함
        failUrl: "https://my-spontany.vercel.app/payment-fail",
        customerName: "Spontany 사용자",
        paymentMethod: "카드",
      }),
    });

    const data = await tossRes.json();

    if (!tossRes.ok) {
      console.error("❌ Toss 결제 생성 실패:", data);
      return res.status(500).json({ error: "Toss payment creation failed", detail: data });
    }

    console.log("✅ 결제 URL 생성 완료:", data.paymentUrl);
    return res.status(200).json({ paymentUrl: data.paymentUrl });

  } catch (error) {
    console.error("❌ 서버 오류:", error);
    return res.status(500).json({ error: "Internal Server Error", detail: error.message });
  }
}