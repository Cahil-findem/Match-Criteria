import { useState } from 'react'

function AttributeExplorer({ category, onClose, version = 1 }) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 250) // Match animation duration
  }
  // Category-specific data for the explorer
  const explorerData = {
    'Findem Magic': {
      categories: [
        'Personal Traits',
        'DEI Attributes',
        'Career Achievements',
        'Education Background',
        'Community Involvement',
        'Publications & Patents',
        'Certifications',
        'Awards & Recognition',
        'Language Skills'
      ]
    },
    'Job Title': {
      categories: [
        'Engineering',
        'Finance',
        'Human Resources',
        'Legal',
        'Marketing',
        'Medical',
        'Product',
        'Sales',
        'Support'
      ]
    },
    'Companies': {
      categories: [
        'Technology',
        'Financial Services',
        'Healthcare',
        'Retail & E-commerce',
        'Manufacturing',
        'Consulting',
        'Media & Entertainment',
        'Education',
        'Non-Profit'
      ]
    },
    'Company Attributes': {
      categories: [
        'Funding Stage',
        'Company Stage',
        'Product Category',
        'Business Model',
        'Growth Rate',
        'Investors',
        'Accelerators',
        'Company Culture',
        'Tech Stack'
      ]
    },
    'Company Size': {
      categories: [
        'Startup (1-50)',
        'Small (51-200)',
        'Medium (201-1000)',
        'Large (1001-5000)',
        'Enterprise (5000+)',
        'Mega Corp (10000+)'
      ]
    },
    'Industries': {
      categories: [
        'Software & Technology',
        'Financial Services',
        'Healthcare & Life Sciences',
        'Manufacturing & Industrial',
        'Retail & Consumer',
        'Media & Entertainment',
        'Professional Services',
        'Education & Research',
        'Energy & Utilities'
      ]
    }
  }

  const currentData = explorerData[category] || explorerData['Job Title']
  const categories = currentData.categories
  const [selectedCategory, setSelectedCategory] = useState(categories[0])

  return (
    <div className={`bg-white border border-[#eaecf0] flex h-full relative ${isClosing ? 'animate-slideOutRight' : 'animate-slideInRight'}`}>
      {/* Categories Column */}
      <div className="bg-gray-50 border-r border-[#eaecf0] flex flex-col gap-3 h-full pb-0 pt-5 px-5 rounded-bl-lg rounded-tl-lg w-[280px]">
        {/* Header */}
        <div className="flex gap-2 items-center px-2 w-full">
          <div className="flex gap-2 h-8 items-center">
            <h3
              className="text-[#101828] text-base font-medium"
              style={{ fontFamily: 'Roboto', lineHeight: '25.6px' }}
            >
              {category}
            </h3>
          </div>
          <div className="bg-[rgba(220,223,234,0.4)] flex gap-1 items-center overflow-hidden pl-1.5 pr-1 py-1 rounded-[4px]">
            <p
              className="text-[#101828] text-xs font-normal"
              style={{ fontFamily: 'Roboto', lineHeight: '14.4px' }}
            >
              {version === 5 ? 'Must Have' : 'Past/current'}
            </p>
            <span className="material-icons-round text-[#101828] text-sm">
              keyboard_arrow_down
            </span>
          </div>
        </div>

        {/* Category List */}
        <div className="flex-1 flex flex-col gap-0 w-full overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex gap-2 items-center overflow-hidden p-2 rounded-md relative ${
                selectedCategory === cat
                  ? 'bg-[#e1efff] text-[#167ff9]'
                  : 'text-[#101828]'
              }`}
            >
              <p
                className="flex-1 text-left text-sm font-normal"
                style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
              >
                {cat}
              </p>
              <span
                className={`material-icons-round text-lg ${
                  selectedCategory === cat ? 'text-[#167ff9]' : 'text-[#667085]'
                }`}
              >
                keyboard_arrow_right
              </span>
              {selectedCategory === cat && (
                <div className="absolute bg-[#4599fa] h-9 right-[-21px] rounded-[30px] top-0 w-[3px]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute bg-white flex gap-1.5 h-8 items-center justify-end overflow-hidden pl-3 pr-[7px] py-2 right-[-30px] rounded-br-[46px] rounded-tr-[46px] top-5 w-[30px] hover:bg-gray-50 transition-colors z-30"
      >
        <span className="material-icons-round text-[#667085] text-lg">
          close
        </span>
      </button>
    </div>
  )
}

export default AttributeExplorer
