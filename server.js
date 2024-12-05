import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

// สร้างการเชื่อมต่อกับฐานข้อมูล
const db = new sqlite3.Database('./xo_game.db', (err) => {
  if (err) {
    console.error('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล:', err)
  } else {
    console.log('เชื่อมต่อฐานข้อมูลสำเร็จ')
  }
})

// สร้างตาราง
db.serialize(() => {
  // ลบตารางเดิมถ้ามี
  db.run('DROP TABLE IF EXISTS games')
  
  // สร้างตารางใหม่
  db.run(`
    CREATE TABLE games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      winner TEXT NOT NULL,
      moves TEXT NOT NULL,
      player_type TEXT NOT NULL,
      board_size INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
})

// API Endpoints

// บันทึกเกมใหม่
app.post('/api/games', (req, res) => {
  const { winner, moves, playerType, boardSize } = req.body
  const date = new Date().toISOString()
  
  db.run(
    'INSERT INTO games (date, winner, moves, player_type, board_size) VALUES (?, ?, ?, ?, ?)',
    [date, winner, JSON.stringify(moves), playerType, boardSize],
    function(err) {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการบันทึกเกม:', err)
        res.status(500).json({ error: err.message })
        return
      }
      res.json({
        id: this.lastID,
        date,
        winner,
        moves,
        player_type: playerType,
        board_size: boardSize
      })
    }
  )
})

// ดึงประวัติการเล่นทั้งหมด
app.get('/api/games', (req, res) => {
  db.all('SELECT * FROM games ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

// ดึงข้อมูลเกมเดียว
app.get('/api/games/:id', (req, res) => {
  db.get('SELECT * FROM games WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'ไม่พบข้อมูลเกม' })
      return
    }
    res.json(row)
  })
})

// ลบข้อมูลเกม
app.delete('/api/games/:id', (req, res) => {
  const { id } = req.params
  db.run('DELETE FROM games WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'ไม่พบข้อมูลเกมที่ต้องการลบ' })
      return
    }
    res.json({ message: 'ลบข้อมูลเกมสำเร็จ' })
  })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server กำลังทำงานที่ port ${PORT}`)
}) 