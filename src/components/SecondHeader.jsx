import { useState } from 'react'

function SecondHeader() {
  const [activeTab, setActiveTab] = useState('candidates')

  const tabs = [
    { id: 'candidates', icon: 'person_search', label: 'Candidates', count: 200 },
    { id: 'shortlist', icon: 'people', label: 'Shortlist', count: 50 },
    { id: 'campaigns', icon: 'mail', label: 'Campaigns', count: 1 },
  ]

  return (
    <div className="bg-white border-b border-[#eaecf0] w-full">
      <div className="flex items-start justify-between px-8 pt-3">
        {/* Tabs */}
        <div className="flex items-start gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-start gap-1.5 px-1 pb-2 border-b-[3px] transition-colors ${
                activeTab === tab.id
                  ? 'border-[#4599fa]'
                  : 'border-transparent'
              }`}
            >
              <div className="flex items-start gap-1.5 p-1 rounded">
                <span
                  className={`material-icons text-[18px] leading-[22px] ${
                    activeTab === tab.id ? 'text-[#167ff9]' : 'text-[#667085]'
                  }`}
                  style={{ fontSize: '18px' }}
                >
                  {tab.icon}
                </span>
                <div className="flex items-start gap-1 text-sm font-normal">
                  <span
                    className={activeTab === tab.id ? 'text-[#0f42bc]' : 'text-[#465366]'}
                    style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                  >
                    {tab.label}
                  </span>
                  <span
                    className={activeTab === tab.id ? 'text-[#167ff9]' : 'text-[#969dad]'}
                    style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                  >
                    ({tab.count})
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Insights Report Button */}
        <div className="flex items-center justify-end pb-2">
          <button className="flex items-center gap-1 px-1.5 py-1 rounded-md hover:bg-gray-100 transition-colors">
            <span
              className="material-icons text-[#465366] text-[18px]"
              style={{ fontSize: '18px' }}
            >
              insert_chart
            </span>
            <span
              className="text-[#465366] text-sm font-normal text-center"
              style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
            >
              Insights Report
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SecondHeader
