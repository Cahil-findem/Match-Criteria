import { useState } from 'react'

function HorizontalTabs() {
  const [activeTab, setActiveTab] = useState('copilot')

  const tabs = [
    { id: 'copilot', label: 'Copilot', count: '50+', hasIcon: true },
    { id: 'inbounds', label: 'Inbounds', count: '149' },
    { id: 'ats', label: 'ATS', count: '42' },
    { id: 'internal', label: 'Internal', count: '7' },
    { id: 'crm', label: 'CRM', count: '84' },
    { id: 'connections', label: 'Connections', count: '2K+' },
    { id: 'alumni', label: 'Alumni', count: '4' },
    { id: 'external', label: 'External', count: '18k+' },
  ]

  return (
    <div className="flex items-start gap-2.5 w-full pl-6 pr-8 py-4 bg-white">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-colors ${
            activeTab === tab.id && tab.hasIcon
              ? 'bg-gradient-to-r from-[rgba(229,223,255,0.5)] to-[rgba(229,223,255,0.5)]'
              : activeTab === tab.id
              ? 'bg-[#f3f5f8]'
              : 'bg-[#f3f5f8] hover:bg-gray-200'
          }`}
        >
          {tab.hasIcon && activeTab === tab.id && (
            <span className="material-icons-round text-[#735bf3]" style={{ fontSize: '14px' }}>
              auto_awesome
            </span>
          )}
          <span
            className={`text-sm font-normal ${
              activeTab === tab.id && tab.hasIcon
                ? 'text-[#4a2edf]'
                : 'text-[#667085]'
            }`}
            style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
          >
            {tab.label}
          </span>
          <span
            className={`text-sm font-normal ${
              activeTab === tab.id && tab.hasIcon
                ? 'text-[#735bf3]'
                : 'text-[#667085]'
            }`}
            style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
          >
            ({tab.count})
          </span>
        </button>
      ))}
    </div>
  )
}

export default HorizontalTabs
