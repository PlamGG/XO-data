function SizeSelector({ size, onSizeChange }) {
  const sizes = [3, 4, 5, 6]

  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        ขนาดตาราง
      </label>
      <div className="flex gap-2">
        {sizes.map((n) => (
          <button
            key={n}
            onClick={() => onSizeChange(n)}
            className={`
              px-4 py-2 rounded-lg font-medium
              ${size === n 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}
              transition-colors
            `}
          >
            {n}x{n}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SizeSelector 