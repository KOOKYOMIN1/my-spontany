export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // ✅ OPENAI_API_KEY 주의: VITE_ 접두사 없이 서버에서만 사용
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 60,
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("❌ GPT 응답 이상:", data);
      return res.status(500).json({ error: "No response from OpenAI" });
    }

    const message = data.choices[0].message.content.trim();
    return res.status(200).json({ message });
  } catch (error) {
    console.error("❌ 프록시 서버 오류:", error);
    return res.status(500).json({ error: "OpenAI 프록시 호출 실패", details: error.message });
  }
}