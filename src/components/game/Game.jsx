import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Board from './Board'
import { calculateWinner } from '../../utils/gameLogic'
import { findBestMove, getRandomMove } from '../../utils/aiLogic'

function Game() {
  const navigate = useNavigate()
  const location = useLocation()
  const { size = 3, isPlayingAI = false } = location.state || {}
  
  const [board, setBoard] = useState(Array(size * size).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [history, setHistory] = useState([])
  const [gameEnded, setGameEnded] = useState(false)

  const handleClick = (i) => {
    if (board[i] || calculateWinner(board, size) || gameEnded) return

    const newBoard = [...board]
    newBoard[i] = isXNext ? 'X' : 'O'
    const newHistory = [...history, { board: newBoard, position: i }]
    
    setBoard(newBoard)
    setHistory(newHistory)
    setIsXNext(!isXNext)

    const winner = calculateWinner(newBoard, size)
    const isBoardFull = newBoard.every(square => square !== null)
    
    if (winner || isBoardFull) {
      setGameEnded(true)
      setTimeout(() => {
        saveGame(winner || 'Draw', newHistory)
      }, 0)
    }
  }

  const saveGame = async (winner, finalHistory) => {
    try {
      const response = await fetch('http://localhost:3000/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          winner,
          moves: finalHistory,
          playerType: isPlayingAI ? 'AI' : 'HUMAN',
          boardSize: size
        })
      })
      const data = await response.json()
      console.log('บันทึกเกมสำเร็จ:', data)
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกเกม:', error)
    }
  }

  useEffect(() => {
    if (isPlayingAI && !isXNext && !calculateWinner(board, size) && !gameEnded) {
      setTimeout(() => {
        let movePosition
        
        // ใช้ Minimax สำหรับบอร์ด 3x3
        if (size === 3) {
          movePosition = findBestMove([...board])
        } 
        // ใช้การสุ่มสำหรับบอร์ดขนาดใหญ่กว่า
        else {
          movePosition = getRandomMove([...board])
        }

        if (movePosition !== null) {
          handleClick(movePosition)
        }
      }, 500)
    }
  }, [isXNext, board, size, gameEnded])

  const winner = calculateWinner(board, size)
  const isBoardFull = board.every(square => square !== null)

  const getStatusMessage = () => {
    if (winner) {
      return `🎉 ผู้ชนะ: ${winner}`
    } else if (isBoardFull) {
      return "🤝 เกมเสมอ!"
    } else if (gameEnded) {
      return "🏁 เกมจบแล้ว"
    } else {
      return `${isXNext ? '❌' : '⭕'} ตาของ: ${isXNext ? 'X' : 'O'}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">XO Game</h1>
              <div className="flex gap-3 text-sm">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                  🎮 {size}x{size}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                  {isPlayingAI ? '🤖 เล่นกับ AI' : '👥 เล่นกับเพื่อน'}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              ออกเกม
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className={`
            mb-6 p-4 rounded-lg text-center font-medium text-lg
            ${winner ? 'bg-green-100 text-green-800 border border-green-200' : 
              isBoardFull ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
              'bg-blue-100 text-blue-800 border border-blue-200'}
            transform transition-all duration-200 hover:scale-102
          `}>
            {getStatusMessage()}
          </div>

          <div className="transform transition-all duration-200 hover:scale-[1.01]">
            <Board squares={board} size={size} onClick={handleClick} />
          </div>

          <div className="mt-6 space-y-3">
            {(winner || isBoardFull) && (
              <button
                onClick={() => {
                  setBoard(Array(size * size).fill(null))
                  setIsXNext(true)
                  setHistory([])
                  setGameEnded(false)
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                  text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 
                  transform hover:scale-[1.02] hover:shadow-lg
                  flex items-center justify-center gap-2"
              >
                🔄 เริ่มเกมใหม่
              </button>
            )}

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-600">จำนวนตาที่เล่น</div>
                <div className="text-2xl font-bold text-gray-800">{history.length}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">ตาปัจจุบัน</div>
                <div className="text-2xl font-bold text-gray-800">{isXNext ? 'X' : 'O'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game