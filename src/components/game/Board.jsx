function Board({ squares, size, onClick }) {
    return (
      <div 
        className="grid gap-3 w-full max-w-2xl mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` 
        }}
      >
        {squares.map((square, i) => (
          <button
            key={i}
            onClick={() => onClick(i)}
            className={`
              aspect-square text-2xl md:text-4xl font-bold
              flex items-center justify-center
              bg-white hover:bg-gray-50
              border-2 border-gray-200
              rounded-xl shadow-sm
              transition-all duration-200
              ${square === 'X' ? 'text-blue-500' : 'text-red-500'}
            `}
          >
            {square}
          </button>
        ))}
      </div>
    )
  }
  
  export default Board