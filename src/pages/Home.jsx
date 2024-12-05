import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const [size, setSize] = useState(3)
  const [isCustomSize, setIsCustomSize] = useState(false)
  const [isPlayingAI, setIsPlayingAI] = useState(false)

  const handleSizeChange = (e) => {
    const value = e.target.value
    // ตรวจสอบว่าเป็นตัวเลขและอยู่ในช่วง 3-10
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= 3 && numValue <= 10) {
      setSize(numValue)
    }
  }

  const handleStartGame = () => {
    navigate('/game', { 
      state: { 
        size, 
        isPlayingAI 
      } 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">XO Game</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* เลือกขนาดตาราง */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ขนาดตาราง
            </label>
            <div className="space-y-3">
              {/* ตัวเลือก 3x3 */}
              <button
                onClick={() => {
                  setIsCustomSize(false)
                  setSize(3)
                }}
                className={`
                  w-full px-4 py-2 rounded-lg font-medium
                  ${!isCustomSize 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}
                  transition-colors
                `}
              >
                3x3
              </button>

              {/* ตัวเลือกกำหนดเอง */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsCustomSize(true)}
                  className={`
                    w-full px-4 py-2 rounded-lg font-medium
                    ${isCustomSize 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}
                    transition-colors
                  `}
                >
                  กำหนดเอง
                </button>
                
                {isCustomSize && (
                  <div className="flex items-center gap-2 px-2">
                    <input
                      type="number"
                      value={size}
                      onChange={handleSizeChange}
                      min="3"
                      max="10"
                      className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">x</span>
                    <input
                      type="number"
                      value={size}
                      disabled
                      className="w-20 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>
                )}
              </div>
            </div>
            {isCustomSize && (
              <p className="text-sm text-gray-500 mt-1 px-2">
                กรุณาระบุขนาดระหว่าง 3-10
              </p>
            )}
          </div>

          {/* เลือกโหมดการเล่น */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              โหมดการเล่น
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsPlayingAI(false)}
                className={`
                  px-4 py-2 rounded-lg font-medium
                  ${!isPlayingAI 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}
                  transition-colors
                `}
              >
                เล่นกับเพื่อน
              </button>
              <button
                onClick={() => setIsPlayingAI(true)}
                className={`
                  px-4 py-2 rounded-lg font-medium
                  ${isPlayingAI 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}
                  transition-colors
                `}
              >
                เล่นกับ AI
              </button>
            </div>
          </div>

          {/* ปุ่มเริ่มเกมและดูประวัติ */}
          <div className="space-y-2">
            <button 
              onClick={handleStartGame}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              เริ่มเกม
            </button>
            <button 
              onClick={() => navigate('/history')}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-6 rounded-lg border border-gray-200 transition-colors"
            >
              ประวัติการเล่น
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 