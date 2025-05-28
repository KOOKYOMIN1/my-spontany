// 위치: /api/generate-theme.js (Vercel root 기준)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 로그로 확인
    console.log("🔑 OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

    const { prompt } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Invalid prompt" });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    const data = await openaiRes.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("❌ GPT 응답 이상:", data);
      return res.status(500).json({ error: "No response from OpenAI" });
    }

    const message = data.choices[0].message.content.trim();
    return res.status(200).json({ message });
  } catch (error) {
    console.error("❌ GPT 프록시 호출 실패:", error);
    return res.status(500).json({
      error: "OpenAI 프록시 호출 실패",
      details: error.message,
    });
  }
}