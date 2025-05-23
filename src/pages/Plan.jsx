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
    <div style={{ padding: '2rem' }}>
      <h1>Spontany 여행 계획하기</h1>

      <label>출발지:</label>
      <input
        type="text"
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
        placeholder="예: Seoul"
      />

      <br /><br />

      <label>여행 기간:</label>
      <input
        type="text"
        placeholder="예: 2025-06-01 ~ 06-04"
        // (선택 사항) 나중에 useState로 관리 가능
      />

      <br /><br />

      <label>예산 (₩):</label>
      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="₩ 1000000"
      />

      <br /><br />

      <label>감정 선택:</label>
      <div>
        <button onClick={() => setMood('기분전환')}>😐 기분전환</button>
        <button onClick={() => setMood('힐링')}>😴 힐링</button>
        <button onClick={() => setMood('설렘')}>💘 설렘</button>
      </div>

      <br /><br />

      <label>동행 찾기:</label>
      <input
        type="checkbox"
        checked={isWithCompanion}
        onChange={(e) => setIsWithCompanion(e.target.checked)}
      /> {isWithCompanion ? '동행' : '혼자'}

      <br /><br />

      <button style={{ marginTop: '1rem' }} onClick={handleSubmit}>
        ✨ 즉흥 여행 생성하기
      </button>
    </div>
  )
}

export default Plan