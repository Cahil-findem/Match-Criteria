function Header() {
  return (
    <div className="bg-white border-b border-[#eaecf0] w-full">
      <div className="flex items-center justify-between px-8 py-3">
        {/* Left Actions */}
        <div className="flex items-center gap-1">
          <button className="flex items-center justify-center p-1 rounded-md hover:bg-gray-100 transition-colors">
            <span className="material-icons text-[#465366] text-[18px]" style={{ fontSize: '18px' }}>
              arrow_back
            </span>
          </button>
          <button className="flex items-center gap-1 px-1 py-1 rounded-md hover:bg-gray-100 transition-colors">
            <span className="text-[#465366] text-sm font-normal">Software Engineer</span>
            <span className="material-icons text-[#465366] text-[18px]" style={{ fontSize: '18px' }}>
              expand_more
            </span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Icon Buttons */}
          <div className="flex items-center gap-1.5">
            <button className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 transition-colors">
              <span className="material-icons text-[#667085] text-[20px]" style={{ fontSize: '20px' }}>
                update
              </span>
            </button>
            <button className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 transition-colors">
              <span className="material-icons text-[#667085] text-[20px]" style={{ fontSize: '20px' }}>
                save
              </span>
            </button>
            <button className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 transition-colors">
              <span className="material-icons text-[#667085] text-[20px]" style={{ fontSize: '20px' }}>
                bolt
              </span>
            </button>
            <button className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 transition-colors">
              <span className="material-icons text-[#667085] text-[20px]" style={{ fontSize: '20px' }}>
                add_link
              </span>
            </button>
            <button className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 transition-colors">
              <span className="material-icons text-[#667085] text-[20px]" style={{ fontSize: '20px' }}>
                more_vert
              </span>
            </button>
          </div>

          {/* Collaborator Avatar */}
          <div className="flex items-center justify-center w-7 h-7 bg-[#167ff9] rounded-full">
            <span className="text-white text-xs font-normal">GH</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
