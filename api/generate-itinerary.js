export default async function handler(req, res) {
  const { mood, destination, days } = req.body;

  const prompt = `
당신은 감성적인 여행 플래너입니다.
"${mood}" 감정을 주제로 "${destination}"에서 ${days}일간의 여행 일정을 하루 단위로 만들어주세요.
간단한 설명과 함께 각 일정은 하루에 3~4개의 활동으로 구성해 주세요.
`;

  try {
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const result = await gptRes.json();
    const text = result.choices[0]?.message?.content || '결과 없음';
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: 'GPT 요청 실패' });
  }
}