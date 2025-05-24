import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Result() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const departure = params.get("departure");
  const budget = params.get("budget");
  const mood = params.get("mood");
  const companion = params.get("companion");

  const emotionToCityMap = {
    기분전환: { city: "Bangkok", message: "바쁜 일상 속, 방콕에서 활력을 찾아보세요 🌇" },
    힐링: { city: "Bali", message: "발리의 따뜻한 바람이 당신을 감싸줄 거예요 🌴" },
    설렘: { city: "Paris", message: "파리의 밤, 에펠탑 아래 당신의 마음이 두근거릴 거예요 💘" },
  };

  const selected = emotionToCityMap[mood] || {
    city: "오사카",
    message: "오사카에서 맛있는 음식과 힐링을 동시에 즐겨보세요 🍜",
  };

  const [imageUrl, setImageUrl] = useState("");
  const [aiMessage, setAiMessage] = useState("문장을 생성 중입니다...");
  const [copied, setCopied] = useState(false);

  // 📸 도시 이미지 가져오기
  useEffect(() => {
    if (selected.city !== "오사카") {
      fetch(`https://api.pexels.com/v1/search?query=${selected.city}&per_page=1`, {
        headers: {
          Authorization: import.meta.env.VITE_PEXELS_API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.photos.length > 0) {
            setImageUrl(data.photos[0].src.large);
          }
        });
    }
  }, [selected.city]);

  // 💡 GPT-4o 감성 문장 생성
  useEffect(() => {
    const fetchThemeSentence = async () => {
      console.log("✅ OpenAI 키:", import.meta.env.VITE_OPENAI_API_KEY);

      try {
        const prompt = `감정: ${mood}, 출발지: ${departure}, 예산: ${budget}, 여행지: ${selected.city}에 어울리는 감성적인 한 문장의 여행 테마를 만들어줘.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o", // ← 여기 GPT-4o로 변경됨
            messages: [{ role: "user", content: prompt }],
            max_tokens: 60,
            temperature: 0.8,
          }),
        });

        const data = await response.json();
        const message = data.choices?.[0]?.message?.content?.trim();
        setAiMessage(message || "여행 테마를 불러오는 데 문제가 발생했어요.");
      } catch (error) {
        console.error("❌ 감성 문장 생성 실패:", error);
        setAiMessage("여행 테마를 불러오는 데 실패했어요.");
      }
    };

    fetchThemeSentence();
  }, [mood, departure, budget, selected.city]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">✈️ 추천 여행지 결과</h1>
      <p><strong>출발지:</strong> {departure}</p>
      <p><strong>예산:</strong> ₩{budget}</p>
      <p><strong>감정:</strong> {mood}</p>
      <p><strong>동행:</strong> {companion === "true" ? "동행" : "혼자"}</p>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">🎉 추천 여행지는…</h2>
      <h3 className="text-lg font-bold text-green-700 mb-2">{selected.city}</h3>
      <p className="text-gray-700 mb-4">{selected.message}</p>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={selected.city}
          className="w-full h-64 object-cover rounded-2xl shadow mb-6"
        />
      )}

      <h2 className="text-xl font-semibold mb-2">💡 AI 감성 한 줄</h2>
      <p className="text-lg text-gray-800 mb-6">{aiMessage}</p>

      <button
        onClick={handleCopyLink}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
      >
        🔗 여행 계획 링크 복사
      </button>
      {copied && (
        <p className="mt-2 text-green-500 text-sm">
          복사 완료! 친구에게 공유해보세요 😎
        </p>
      )}
    </div>
  );
}

export default Result;