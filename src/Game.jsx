import { useState, useEffect } from 'react'
import './App.css'

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [history, setHistory] = useState([])
  const [isPlayingAI, setIsPlayingAI] = useState(false)

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]
    
    for (let line of lines) {
      const [a, b, c] = line
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const aiMove = () => {
    const emptySquares = board.map((square, idx) => square === null ? idx : null).filter(idx => idx !== null)
    if (emptySquares.length > 0) {
      const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)]
      handleClick(randomSquare)
    }
  }

  const handleClick = (i) => {
    if (board[i] || calculateWinner(board)) return

    const newBoard = [...board]
    newBoard[i] = isXNext ? 'X' : 'O'
    setBoard(newBoard)
    setHistory([...history, { board: newBoard, position: i }])
    setIsXNext(!isXNext)
  }

  const saveGame = async (winner) => {
    try {
      const response = await fetch('http://localhost:3000/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          winner,
          moves: history,
          playerType: isPlayingAI ? 'AI' : 'HUMAN'
        })
      })
      const data = await response.json()
      console.log('บันทึกเกมสำเร็จ:', data)
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกเกม:', error)
    }
  }

  useEffect(() => {
    if (isPlayingAI && !isXNext && !calculateWinner(board)) {
      setTimeout(aiMove, 500)
    }
  }, [isXNext, isPlayingAI])

  useEffect(() => {
    const winner = calculateWinner(board)
    if (winner) {
      saveGame(winner)
    }
  }, [board])

  return (
    <div className="game">
      <h1>เกม XO</h1>
      <div className="board">
        {board.map((square, i) => (
          <button key={i} className="square" onClick={() => handleClick(i)}>
            {square}
          </button>
        ))}
      </div>
      <div className="controls">
        <button onClick={() => setIsPlayingAI(!isPlayingAI)}>
          {isPlayingAI ? 'เล่นกับเพื่อน' : 'เล่นกับ AI'}
        </button>
        <button onClick={() => {
          setBoard(Array(9).fill(null))
          setHistory([])
          setIsXNext(true)
        }}>เริ่มเกมใหม่</button>
      </div>
      <div className="status">
        {calculateWinner(board) 
          ? `ผู้ชนะ: ${calculateWinner(board)}`
          : `ผู้เล่นถัดไป: ${isXNext ? 'X' : 'O'}`}
      </div>
    </div>
  )
}

export default Game 