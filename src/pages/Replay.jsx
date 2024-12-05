import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Board from '../components/game/Board'

function Replay() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [replayData, setReplayData] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [board, setBoard] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReplayData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/games/${id}`)
        const data = await response.json()
        
        if (!data) {
          setError('ไม่พบข้อมูลเกม')
          return
        }

        let parsedMoves
        try {
          parsedMoves = typeof data.moves === 'string' ? JSON.parse(data.moves.replace(/\\/g, '')) : data.moves
          if (!Array.isArray(parsedMoves)) {
            parsedMoves = [parsedMoves]
          }
        } catch (e) {
          setError('ข้อมูลการเดินไม่ถูกต้อง')
          return
        }

        const boardSize = Math.sqrt(parsedMoves[0]?.board?.length || 0)
        if (!Number.isInteger(boardSize) || boardSize < 3 || boardSize > 10) {
          setError('ขนาดเกมไม่ถูกต้อง')
          return
        }

        setReplayData({
          ...data,
          moves: parsedMoves,
          board_size: boardSize
        })
        setBoard(Array(boardSize * boardSize).fill(null))
        setError(null)

      } catch (error) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
      }
    }
    fetchReplayData()
  }, [id])

  useEffect(() => {
    let timer
    if (isPlaying && replayData && currentStep < replayData.moves.length) {
      timer = setTimeout(() => {
        const move = replayData.moves[currentStep]
        if (move && move.board) {
          setBoard(move.board)
          setCurrentStep(prev => prev + 1)
        }
      }, 1000)
    } else if (currentStep >= replayData?.moves.length) {
      setIsPlaying(false)
    }
    return () => clearTimeout(timer)
  }, [currentStep, isPlaying, replayData])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setBoard(Array(replayData.board_size * replayData.board_size).fill(null))
    setIsPlaying(false)
  }

  const handleStepForward = () => {
    if (currentStep < replayData.moves.length) {
      const move = replayData.moves[currentStep]
      if (move && move.board) {
        setBoard(move.board)
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const handleStepBackward = () => {
    if (currentStep > 1) {
      const move = replayData.moves[currentStep - 2]
      if (move && move.board) {
        setBoard(move.board)
        setCurrentStep(prev => prev - 1)
      }
    } else {
      setCurrentStep(0)
      setBoard(Array(replayData.board_size * replayData.board_size).fill(null))
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/history')}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
          >
            กลับไปหน้าประวัติ
          </button>
        </div>
      </div>
    )
  }

  if (!replayData || !board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">กำลังโหลด...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Replay เกม</h1>
            <p className="text-gray-600">
              ขนาด: {replayData.board_size}x{replayData.board_size} | 
              โหมด: {replayData.player_type === 'AI' ? 'เล่นกับ AI' : 'เล่นกับเพื่อน'}
            </p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
          >
            กลับ
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-gray-600">
                <div>วันที่เล่น: {new Date(replayData.date).toLocaleString('th-TH')}</div>
                <div>ผู้ชนะ: <span className="font-medium text-gray-900">{replayData.winner}</span></div>
              </div>
              <div className="text-gray-600 text-right">
                <div>ตาที่: {currentStep}/{replayData.moves.length}</div>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <Board 
                squares={board} 
                size={replayData.board_size} 
                onClick={() => {}} 
              />
            </div>

            <div className="flex justify-center gap-2">
              <button
                onClick={handleStepBackward}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                disabled={currentStep === 0}
              >
                ◀
              </button>
              <button
                onClick={handlePlayPause}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {isPlaying ? '⏸️ หยุด' : '▶️ เล่น'}
              </button>
              <button
                onClick={handleStepForward}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                disabled={currentStep >= replayData.moves.length}
              >
                ▶
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                เริ่มใหม่
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Replay 