import { useLocation } from 'react-router-dom'

function Result() {
  const location = useLocation()
  const query = new URLSearchParams(location.search)

  const departure = query.get('departure')
  const budget = query.get('budget')
  const mood = query.get('mood')
  const companion = query.get('companion')

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
  <h1 className="text-2xl font-bold text-blue-600 mb-4">✈️ 추천 여행지 결과</h1>
  <p><strong>출발지:</strong> {departure}</p>
  <p><strong>예산:</strong> ₩{budget}</p>
  <p><strong>감정:</strong> {mood}</p>
  <p><strong>동행:</strong> {companion === 'true' ? '동행' : '혼자'}</p>

  <hr className="my-6" />

  <h2 className="text-xl font-semibold mb-2">🎉 추천 여행지는…</h2>
  <h3 className="text-lg font-bold text-green-700 mb-2">오사카, 일본 🇯🇵</h3>
  <ul className="list-disc list-inside text-left">
    <li>🍜 도톤보리 맛집 거리</li>
    <li>🏯 오사카성 탐방</li>
    <li>🛍️ 신사이바시 쇼핑</li>
      </ul>
    </div>
  )
}

export default Result