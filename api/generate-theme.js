// api/generate-theme.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = JSON.parse(req.body);

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // 🔐 여긴 .env.local에 저장된 진짜 키!
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 60,
        temperature: 0.8,
      }),
    });

    const data = await openaiRes.json();
    const message = data.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ message });
  } catch (error) {
    console.error("❌ 프록시 에러:", error);
    return res.status(500).json({ error: "OpenAI 호출 실패" });
  }
}