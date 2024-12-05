import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game from './components/game/Game'
import History from './pages/History'
import Replay from './pages/Replay'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/history" element={<History />} />
        <Route path="/replay/:id" element={<Replay />} />
      </Routes>
      <div className="h-16 bg-gray-800">ssdsadsasd</div>
    </Router>

    
  )
}

export default App

