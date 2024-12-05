export const calculateWinner = (squares, size) => {
  // ตรวจแนวนอน
  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - size; j++) {
      const row = squares.slice(i * size + j, i * size + j + size)
      if (row.every(cell => cell === 'X')) return 'X'
      if (row.every(cell => cell === 'O')) return 'O'
    }
  }

  // ตรวจแนวตั้ง
  for (let i = 0; i < size; i++) {
    const column = []
    for (let j = 0; j < size; j++) {
      column.push(squares[j * size + i])
    }
    if (column.every(cell => cell === 'X')) return 'X'
    if (column.every(cell => cell === 'O')) return 'O'
  }

  // ตรวจแนวทแยงจากซ้ายบนไปขวาล่าง
  const diagonal1 = []
  for (let i = 0; i < size; i++) {
    diagonal1.push(squares[i * size + i])
  }
  if (diagonal1.every(cell => cell === 'X')) return 'X'
  if (diagonal1.every(cell => cell === 'O')) return 'O'

  // ตรวจแนวทแยงจากขวาบนไปซ้ายล่าง
  const diagonal2 = []
  for (let i = 0; i < size; i++) {
    diagonal2.push(squares[i * size + (size - 1 - i)])
  }
  if (diagonal2.every(cell => cell === 'X')) return 'X'
  if (diagonal2.every(cell => cell === 'O')) return 'O'

  return null
} 