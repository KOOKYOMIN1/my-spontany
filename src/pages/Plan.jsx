import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Plan() {
  const [departure, setDeparture] = useState('')
  const [budget, setBudget] = useState('')
  const [mood, setMood] = useState('')
  const [isWithCompanion, setIsWithCompanion] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = () => {
    const params = new URLSearchParams({
      departure,
      budget,
      mood,
      companion: isWithCompanion,
    })

    navigate(`/result?${params.toString()}`)
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Spontany 여행 계획하기</h1>

      <label className="block mb-2">출발지:</label>
      <input
        type="text"
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
        placeholder="예: Seoul"
        className="border border-gray-300 p-2 rounded w-full mb-4"
      />

      <label className="block mb-2">여행 기간:</label>
      <input
        type="text"
        placeholder="예: 2025-06-01 ~ 06-04"
        className="border border-gray-300 p-2 rounded w-full mb-4"
      />

      <label className="block mb-2">예산 (₩):</label>
      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="₩ 1000000"
        className="border border-gray-300 p-2 rounded w-full mb-4"
      />

      <label className="block mb-2">감정 선택:</label>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${mood === '기분전환' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setMood('기분전환')}
        >
          😐 기분전환
        </button>
        <button
          className={`px-3 py-1 rounded ${mood === '힐링' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setMood('힐링')}
        >
          😴 힐링
        </button>
        <button
          className={`px-3 py-1 rounded ${mood === '설렘' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setMood('설렘')}
        >
          💘 설렘
        </button>
      </div>

      <label className="block mb-2">동행 찾기:</label>
      <label className="flex items-center mb-6">
        <input
          type="checkbox"
          checked={isWithCompanion}
          onChange={(e) => setIsWithCompanion(e.target.checked)}
          className="mr-2"
        />
        {isWithCompanion ? '동행' : '혼자'}
      </label>

      <button
        onClick={handleSubmit}
        className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
      >
        ✨ 즉흥 여행 생성하기
      </button>
    </div>
  )
}

export default Plan