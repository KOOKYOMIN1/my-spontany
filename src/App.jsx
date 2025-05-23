import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Plan from './pages/Plan'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Plan />} />
        {/* 추후에 /result, /match 등도 추가 가능 */}
      </Routes>
    </BrowserRouter>
  )
}

export default App