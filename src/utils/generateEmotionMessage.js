export const generateEmotionMessage = async (mood) => {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  const systemPrompt = `당신은 감정을 기반으로 감성적인 여행 문장을 만들어주는 여행 작가입니다. 사용자 감정에 따라 감동적인 한 줄을 생성하세요. 너무 길지 않게 자연스럽고 따뜻한 느낌으로 써주세요.`;

  const userPrompt = `"${mood}"이라는 감정에 어울리는 여행 한 줄 추천 문장을 만들어줘.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 100,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "감성 문장 생성 실패";
};