function CandidateListHeader() {
  return (
    <div className="bg-[#f2f4f7] border border-[#eaecf0] border-b-0 px-6 py-2 rounded-tl-xl rounded-tr-xl">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Title */}
        <div className="flex items-center gap-3 w-[260px]">
          <div className="flex items-center gap-0.5">
            <p
              className="text-[#30374f] text-sm"
              style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
            >
              <span className="font-medium">50+ </span>
              <span className="font-normal">candidates sourced by Copilot</span>
            </p>
            <span className="material-icons text-[#667085] text-base" style={{ fontSize: '16px' }}>
              settings
            </span>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-start justify-end gap-2.5">
          {/* Layout Toggle with Yellow Background */}
          <div className="bg-[#ffe066] p-0.5 rounded-lg">
            <button className="flex items-center justify-center w-8 h-8 bg-[#ffe066] rounded-md">
              <span className="material-icons text-[#465366] text-lg" style={{ fontSize: '18px' }}>
                border_color
              </span>
            </button>
          </div>

          {/* Channels Button */}
          <button className="flex items-center gap-1.5 px-3 py-2 h-9 bg-white border border-[#dcdfea] rounded-lg hover:bg-gray-50 transition-colors">
            <span className="material-icons-round text-[#667085] text-lg" style={{ fontSize: '18px' }}>
              tune
            </span>
            <span
              className="text-[#667085] text-sm font-normal"
              style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
            >
              Channels
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CandidateListHeader
