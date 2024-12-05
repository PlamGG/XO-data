# XO Game Project

โปรเจค XO Game ที่พัฒนาด้วย React และ Node.js โดยรองรับการเล่นได้หลายขนาดบอร์ด มีโหมดเล่นกับเพื่อนและเล่นกับ AI

## ความต้องการของระบบ

- Node.js (v14.0.0 หรือสูงกว่า)
- npm (v6.0.0 หรือสูงกว่า)
- SQLite3

## การติดตั้ง (Setup)

1. **Clone โปรเจค:**
   ```bash
   git clone <https://github.com/PlamGG/XO-data.git>
   cd xo-game
   ```

2. **ติดตั้ง Dependencies สำหรับ Frontend:**
   ```bash
   cd client
   npm install
   ```

3. **ติดตั้ง Dependencies สำหรับ Backend:**
   ```bash
   cd server
   npm install
   ```

## การรัน (Run)

1. **รัน Backend Server:**
   ```bash
   cd server
   npm start
   ```
   Server จะทำงานที่ port 3000

2. **รัน Frontend Development Server:**
   ```bash
   cd client
   npm run dev
   ```
   Frontend จะทำงานที่ port 5173


### ฟีเจอร์หลัก

1. เลือกขนาดบอร์ด (3x3 ถึง 10x10)
2. โหมดเล่นกับเพื่อนและ AI
3. บันทึกประวัติการเล่น
4. ดูย้อนหลังการเล่น

## อัลกอริทึม (Algorithms)

### 1. การตรวจสอบผู้ชนะ

javascript
function calculateWinner(squares, size) {
// ตรวจสอบแนวนอน
for (let i = 0; i < size; i++) {
const row = squares.slice(i size, (i + 1) size)
if (row.every(cell => cell === row[0] && cell !== null)) {
return row[0]
}
}
// ตรวจสอบแนวตั้ง
for (let i = 0; i < size; i++) {
const column = Array(size).fill(null)
.map((, index) => squares[i + (index size)])
if (column.every(cell => cell === column[0] && cell !== null)) {
return column[0]
}
}

// ตรวจสอบแนวทแยงมุม
const diagonal1 = Array(size).fill(null)
.map((, index) => squares[index (size + 1)])
const diagonal2 = Array(size).fill(null)
.map((, index) => squares[(index + 1) (size - 1)])
if (diagonal1.every(cell => cell === diagonal1[0] && cell !== null)) {
return diagonal1[0]
}
if (diagonal2.every(cell => cell === diagonal2[0] && cell !== null)) {
return diagonal2[0]
}
return null
}

### 2. AI Logic (Minimax สำหรับ 3x3)


javascript
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


## โครงสร้างฐานข้อมูล

sql
CREATE TABLE games (
id INTEGER PRIMARY KEY AUTOINCREMENT,
date TEXT NOT NULL,
winner TEXT NOT NULL,
moves TEXT NOT NULL,
player_type TEXT NOT NULL,
board_size INTEGER NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


## API Endpoints

- `GET /api/games` - ดึงประวัติการเล่นทั้งหมด
- `GET /api/games/:id` - ดึงข้อมูลเกมตาม ID
- `POST /api/games` - บันทึกเกมใหม่
- `DELETE /api/games/:id` - ลบข้อมูลเกม
