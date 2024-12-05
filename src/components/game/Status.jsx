function Status({ winner, isXNext }) {
  return (
    <div className="text-lg font-medium text-gray-800 mt-4">
      {winner 
        ? <span className="text-green-600">ผู้ชนะ: {winner}</span>
        : `ผู้เล่นถัดไป: ${isXNext ? 'X' : 'O'}`}
    </div>
  )
}

export default Status 