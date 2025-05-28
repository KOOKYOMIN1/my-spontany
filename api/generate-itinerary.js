export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const {
      origin,
      departure,
      mood,
      style,
      budget,
      startDate,
      endDate,
    } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!origin || !departure || !mood || !style || !startDate || !endDate) {
      return res.status(400).json({ error: "필수 정보가 누락되었습니다." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
    const parsedBudget = parseInt(budget?.replace(/[^0-9]/g, "") || "0", 10);

    const regionText =
      departure === "해외"
        ? "해외의 감성적인 도시들 (예: 일본, 베트남, 프랑스 등)"
        : "국내의 아름다운 도시들 (예: 강릉, 전주, 제주 등)";

    const budgetText =
      parsedBudget === 0
        ? `예산이 없는 무자금 여행으로, 히치하이킹, 무료 숙소, 공공시설 등을 활용해주세요.`
        : `총 예산은 약 ${parsedBudget.toLocaleString()}원이며, 교통비, 숙박비, 식비, 체험비 등을 현실적으로 감성 있게 배분해주세요.`;

    const prompt = `
당신은 감성적인 여행 플래너입니다.

사용자는 "${origin}"에서 출발하여 ${regionText}로 여행을 떠납니다.
여행 감정은 "${mood}", 여행 스타일은 "${style}"입니다.
여행 기간은 총 ${days}일이며, 하루에 3~4개의 활동으로 구성된 여행 일정을 원합니다.

${budgetText}
숙소는 서로를 배려하는 마음으로 **각자 따로 예약하는 1인 감성 숙소**로 구성해주세요.

감성적인 문체로 작성해 주시고,
각 일정을 시간대별로 정리해주세요.
`;

    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.85,
      }),
    });

    const result = await gptRes.json();

    if (!result.choices || !result.choices[0]?.message?.content) {
      console.error("❌ GPT 응답 이상:", result);
      return res.status(500).json({ error: "GPT 응답이 올바르지 않습니다." });
    }

    const text = result.choices[0].message.content.trim();
    return res.status(200).json({ itinerary: text });
  } catch (err) {
    console.error("❌ GPT 요청 실패:", err);
    return res.status(500).json({
      error: "GPT 요청 중 오류 발생",
      details: err.message,
    });
  }
}