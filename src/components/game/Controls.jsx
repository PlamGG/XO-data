function Controls({ isPlayingAI, onToggleAI, onReset }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <button
        onClick={onToggleAI}
        className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 rounded-lg border border-gray-200 transition-colors"
      >
        {isPlayingAI ? 'เล่นกับเพื่อน' : 'เล่นกับ AI'}
      </button>
      <button
        onClick={onReset}
        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        เริ่มเกมใหม่
      </button>
    </div>
  )
}

export default Controls 