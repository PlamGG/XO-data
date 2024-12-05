XO Game Project
โปรเจค XO Game ถูกพัฒนาด้วย React และ Node.js รองรับการเล่นหลายขนาดบอร์ด พร้อมโหมดเล่นกับเพื่อนหรือ AI อีกทั้งยังสามารถบันทึกและดูย้อนหลังการเล่นได้!

ความต้องการของระบบ
Node.js: เวอร์ชัน 14.0.0 หรือสูงกว่า
npm: เวอร์ชัน 6.0.0 หรือสูงกว่า
SQLite3: สำหรับจัดการฐานข้อมูล
การติดตั้ง (Setup)
1. Clone โปรเจค
bash
คัดลอกโค้ด
git clone https://github.com/PlamGG/XO-data.git
cd xo-game
2. ติดตั้ง Dependencies
Frontend:

bash
คัดลอกโค้ด
cd client
npm install
Backend:

bash
คัดลอกโค้ด
cd server
npm install
การรัน (Run)
1. รัน Backend Server
bash
คัดลอกโค้ด
cd server
npm start
Server จะทำงานที่ port 3000
2. รัน Frontend Development Server
bash
คัดลอกโค้ด
cd client
npm run dev
Frontend จะทำงานที่ port 5173
ฟีเจอร์หลัก
เลือกขนาดบอร์ด: ตั้งแต่ 3x3 จนถึง 10x10
โหมดการเล่น: เล่นกับเพื่อนหรือ AI
ระบบบันทึกประวัติ: เก็บข้อมูลการเล่นทั้งหมด
ดูย้อนหลัง: เรียกดู Replay การเล่นได้
อัลกอริทึมสำคัญ
1. การตรวจสอบผู้ชนะ
javascript
คัดลอกโค้ด
function calculateWinner(squares, size) {
  // ตรวจสอบแนวนอน
  for (let i = 0; i < size; i++) {
    const row = squares.slice(i * size, (i + 1) * size);
    if (row.every(cell => cell === row[0] && cell !== null)) {
      return row[0];
    }
  }
  
  // ตรวจสอบแนวตั้ง
  for (let i = 0; i < size; i++) {
    const column = Array(size).fill(null)
      .map((_, index) => squares[i + (index * size)]);
    if (column.every(cell => cell === column[0] && cell !== null)) {
      return column[0];
    }
  }

  // ตรวจสอบแนวทแยงมุม
  const diagonal1 = Array(size).fill(null)
    .map((_, index) => squares[index * (size + 1)]);
  const diagonal2 = Array(size).fill(null)
    .map((_, index) => squares[(index + 1) * (size - 1)]);
    
  if (diagonal1.every(cell => cell === diagonal1[0] && cell !== null)) {
    return diagonal1[0];
  }
  if (diagonal2.every(cell => cell === diagonal2[0] && cell !== null)) {
    return diagonal2[0];
  }
  
  return null;
}
2. AI Logic (Minimax Algorithm)
javascript
คัดลอกโค้ด
function minimax(board, depth, isMaximizing) {
  const winner = calculateWinner(board, 3);
  if (winner === 'X') return 10 - depth;
  if (winner === 'O') return depth - 10;
  if (board.every(cell => cell !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        const score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
โครงสร้างฐานข้อมูล
sql
คัดลอกโค้ด
CREATE TABLE games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  winner TEXT NOT NULL,
  moves TEXT NOT NULL,
  player_type TEXT NOT NULL,
  board_size INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



API Endpoints
GET /api/games - ดึงประวัติการเล่นทั้งหมด
GET /api/games/:id - ดึงข้อมูลเกมตาม ID
POST /api/games - บันทึกเกมใหม่
DELETE /api/games/:id - ลบข้อมูลเกม
