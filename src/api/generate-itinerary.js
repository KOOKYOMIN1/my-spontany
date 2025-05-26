export default async function handler(req, res) {
  // ✅ HTTP 메서드 확인 (POST만 허용)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // ✅ Vercel 환경에서는 req.body가 문자열일 수 있으므로 파싱 처리
    const { mood, destination, days } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    // ✅ 필수 파라미터 체크
    if (!mood || !destination || !days) {
      return res.status(400).json({ error: "필수 정보가 누락되었습니다." });
    }

    // ✅ GPT 프롬프트 구성
    const prompt = `
당신은 감성적인 여행 플래너입니다.
"${mood}" 감정을 주제로 "${destination}"에서 ${days}일간의 여행 일정을 하루 단위로 구성해 주세요.
각 일정은 하루에 3~4개의 활동으로 구성해 주시고, 각 활동에는 짧고 감성적인 설명을 덧붙여 주세요.
친절하고 감성적인 어조를 유지해 주세요.
`;

    // ✅ OpenAI API 호출
    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // .env.local 또는 Vercel 환경변수에 반드시 등록
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.85,
      }),
    });

    const result = await gptRes.json();

    // ✅ 응답 유효성 체크
    if (!result.choices || !result.choices[0]?.message?.content) {
      console.error("❌ GPT 응답 이상:", result);
      return res.status(500).json({ error: "GPT 응답이 올바르지 않습니다." });
    }

    const text = result.choices[0].message.content.trim();
    return res.status(200).json({ text });
  } catch (err) {
    console.error("❌ GPT 요청 실패:", err);
    return res.status(500).json({
      error: "GPT 요청 중 오류 발생",
      details: err.message,
    });
  }
}