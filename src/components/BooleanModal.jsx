import { useState } from 'react'

function BooleanModal({ category, onClose, onApply }) {
  const [isClosing, setIsClosing] = useState(false)
  const [roleInput, setRoleInput] = useState('')
  const [searchAttribute, setSearchAttribute] = useState('')
  const [matchType, setMatchType] = useState('is any of')

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  const handleApply = () => {
    // Handle apply logic here
    onApply?.()
    handleClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`fixed inset-0 flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
        <div
          className="bg-white rounded-lg w-full max-w-[700px] max-h-[90vh] flex flex-col shadow-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
            <div className="flex flex-col gap-1">
              <h2
                className="text-[#101828] text-lg font-medium"
                style={{ fontFamily: 'Roboto', lineHeight: '28px' }}
              >
                {category} Boolean Builder
              </h2>
              <p
                className="text-[#667085] text-sm font-normal"
                style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
              >
                Construct boolean strings that use AND/OR logic
              </p>
            </div>
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#f2f4f7] transition-colors"
            >
              <span className="material-icons-round text-[#667085]" style={{ fontSize: '20px' }}>
                close
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="flex flex-col gap-4">
              {/* Top Input Section */}
              <div className="flex gap-2 items-start">
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="Enter Role"
                  className="flex-1 px-3 py-2 border border-[#d0d5dd] rounded-lg text-[#101828] text-sm font-normal outline-none focus:border-[#4599fa] focus:ring-1 focus:ring-[#4599fa]"
                  style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                />
                <button
                  className="px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-[#344054] text-sm font-medium hover:bg-[#f9fafb] transition-colors"
                  style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                >
                  Apply
                </button>
              </div>

              {/* Boolean Builder Section */}
              <div className="flex gap-2 items-center flex-wrap">
                <div className="bg-[#f9fafb] px-3 py-1.5 rounded-lg">
                  <span
                    className="text-[#344054] text-sm font-medium"
                    style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                  >
                    Role
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={matchType}
                    onChange={(e) => setMatchType(e.target.value)}
                    className="appearance-none px-3 py-1.5 pr-8 border border-[#d0d5dd] rounded-lg text-[#344054] text-sm font-normal outline-none focus:border-[#4599fa] focus:ring-1 focus:ring-[#4599fa] bg-white cursor-pointer"
                    style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                  >
                    <option value="is any of">is any of</option>
                    <option value="is all of">is all of</option>
                    <option value="is none of">is none of</option>
                  </select>
                  <span className="material-icons-round text-[#667085] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: '18px' }}>
                    expand_more
                  </span>
                </div>

                <input
                  type="text"
                  value={searchAttribute}
                  onChange={(e) => setSearchAttribute(e.target.value)}
                  placeholder="Search attribute"
                  className="flex-1 min-w-[200px] px-3 py-1.5 border border-[#d0d5dd] rounded-lg text-[#667085] text-sm font-normal outline-none focus:border-[#4599fa] focus:ring-1 focus:ring-[#4599fa]"
                  style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                />
              </div>

              {/* Add another Match link */}
              <div>
                <button
                  className="text-[#4599fa] text-sm font-medium hover:text-[#3182ce] transition-colors"
                  style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                >
                  Add another Match
                </button>
              </div>

              {/* Matches pool */}
              <div className="flex items-baseline gap-1">
                <span
                  className="text-[#4599fa] text-2xl font-medium"
                  style={{ fontFamily: 'Roboto' }}
                >
                  674.5M
                </span>
                <span
                  className="text-[#667085] text-sm font-normal"
                  style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                >
                  * matches pool
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-start gap-2 px-6 py-4 border-t border-[#eaecf0]">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-[#344054] text-sm font-medium hover:bg-[#f9fafb] transition-colors"
              style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-[#4599fa] rounded-lg text-white text-sm font-medium hover:bg-[#3182ce] transition-colors"
              style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default BooleanModal
