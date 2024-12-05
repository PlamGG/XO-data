import { calculateWinner } from './gameLogic'

// Minimax Algorithm สำหรับบอร์ด 3x3
function minimax(board, depth, isMaximizing) {
  const winner = calculateWinner(board, 3)
  
  if (winner === 'X') return 10 - depth
  if (winner === 'O') return depth - 10
  if (board.every(cell => cell !== null)) return 0
  
  if (isMaximizing) {
    let bestScore = -Infinity
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'X'
        const score = minimax(board, depth + 1, false)
        board[i] = null
        bestScore = Math.max(score, bestScore)
      }
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'O'
        const score = minimax(board, depth + 1, true)
        board[i] = null
        bestScore = Math.min(score, bestScore)
      }
    }
    return bestScore
  }
}

// หาตาที่ดีที่สุดสำหรับ AI ในบอร์ด 3x3
function findBestMove(board) {
  let bestScore = -Infinity
  let bestMove = null

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = 'X'
      const score = minimax(board, 0, false)
      board[i] = null
      
      if (score > bestScore) {
        bestScore = score
        bestMove = i
      }
    }
  }

  return bestMove
}

// สุ่มตาสำหรับบอร์ดขนาดใหญ่
function getRandomMove(board) {
  const emptySquares = board
    .map((square, idx) => square === null ? idx : null)
    .filter(idx => idx !== null)
  
  if (emptySquares.length > 0) {
    return emptySquares[Math.floor(Math.random() * emptySquares.length)]
  }
  return null
}

export { findBestMove, getRandomMove } 