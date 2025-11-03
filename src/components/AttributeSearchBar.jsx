import { useState, useRef, useEffect } from 'react'

function AttributeSearchBar({ category, onClose, onSelect, showBrowseAll = false, onBrowseAll, removeButtonBackground = false, qualifier = 'Current', onQualifierChange, useMustHaveQualifier = false }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isClosing, setIsClosing] = useState(false)
  const [selectedQualifier, setSelectedQualifier] = useState(qualifier)
  const containerRef = useRef(null)

  const handleQualifierChange = (newQualifier) => {
    setSelectedQualifier(newQualifier)
    if (onQualifierChange) {
      onQualifierChange(newQualifier)
    }
  }

  // Category-specific data
  const categoryData = {
    'Findem Magic': {
      placeholder: 'Search for traits...',
      header: 'Recommended Traits',
      items: [
        'Past Founder',
        'US Veteran',
        'Academic Achiever',
        'First-Generation College Graduate',
        'Career Changer',
        'Published Author',
        'Patent Holder',
        'Open Source Contributor'
      ]
    },
    'Job Title': {
      placeholder: 'Search for job titles...',
      header: 'Recommended Job Titles',
      items: [
        'Software Engineer',
        'Front-End Engineer',
        'Full-Stack Engineer',
        'Software Engineer Intern',
        'Machine Learning Engineer',
        'DevOps Engineer',
        'Staff Engineer',
        'Principal Engineer'
      ]
    },
    'Location': {
      placeholder: 'Search for locations...',
      header: 'Recommended Locations',
      items: [
        'San Francisco, CA',
        'New York, NY',
        'Seattle, WA',
        'Austin, TX',
        'Remote',
        'Los Angeles, CA',
        'Boston, MA',
        'Denver, CO'
      ]
    },
    'Skills': {
      placeholder: 'Search for skills...',
      header: 'Recommended Skills',
      items: [
        'React',
        'Python',
        'JavaScript',
        'TypeScript',
        'Node.js',
        'AWS',
        'Machine Learning',
        'SQL'
      ]
    },
    'Companies': {
      placeholder: 'Search for companies...',
      header: 'Recommended Companies',
      items: [
        'Google',
        'Meta',
        'Amazon',
        'Microsoft',
        'Apple',
        'Netflix',
        'Tesla',
        'Stripe'
      ]
    },
    'Company Attributes': {
      placeholder: 'Search for attributes...',
      header: 'Recommended Attributes',
      items: [
        'Series A',
        'Series B',
        'Public Company',
        'Unicorn',
        'Y Combinator',
        'Fast Growing',
        'Fortune 500',
        'Tech Startup'
      ]
    },
    'Company Size': {
      placeholder: 'Search for company size...',
      header: 'Recommended Sizes',
      items: [
        '1-10 employees',
        '11-50 employees',
        '51-200 employees',
        '201-500 employees',
        '501-1000 employees',
        '1001-5000 employees',
        '5001-10000 employees',
        '10000+ employees'
      ]
    },
    'Industries': {
      placeholder: 'Search for industries...',
      header: 'Recommended Industries',
      items: [
        'Software & Technology',
        'Financial Services',
        'Healthcare',
        'E-commerce',
        'Enterprise Software',
        'Consumer Technology',
        'Artificial Intelligence',
        'Cybersecurity'
      ]
    }
  }

  const currentData = categoryData[category] || categoryData['Job Title']
  const suggestedItems = currentData.items

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 200) // Match animation duration
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <div ref={containerRef} className={`flex flex-col gap-1.5 pt-1 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
      {/* Search Input */}
      <div className="bg-white border border-[#4599fa] rounded-lg w-[296px]">
        <div className="flex gap-2 items-center overflow-hidden pl-3 pr-1.5 py-2 rounded-inherit w-[296px]">
          <div className="flex items-center flex-1 min-w-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentData.placeholder}
              className="flex-1 min-w-0 text-[#969dad] text-sm font-normal outline-none"
              style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
              autoFocus
            />
            <div className="border-l border-[#eaecf0] flex items-center pl-1 shrink-0">
              <div className="relative flex items-center min-w-0">
                <select
                  value={selectedQualifier}
                  onChange={(e) => handleQualifierChange(e.target.value)}
                  className="appearance-none bg-transparent text-[#465366] text-[13px] font-normal outline-none cursor-pointer pl-1 pr-5"
                  style={{ fontFamily: 'Roboto', lineHeight: '22px' }}
                >
                  {useMustHaveQualifier ? (
                    <>
                      <option value="must-have">Must Have</option>
                      <option value="can-have">Can Have</option>
                      <option value="excluded">Excluded</option>
                    </>
                  ) : (
                    <>
                      <option value="Current">Current</option>
                      <option value="Past">Past</option>
                      <option value="Recent">Recent</option>
                    </>
                  )}
                </select>
                <span className="material-icons-round text-lg absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#465366]">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <div className="flex flex-col gap-2.5 items-start">
        <div className="bg-white border border-[#dcdfea] h-[220px] max-h-[220px] min-h-[110px] rounded-lg w-[296px] relative overflow-hidden shadow-lg">
          <div className="flex flex-col h-full">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto p-1">
              {/* Suggested Header */}
              <div className="flex gap-2.5 items-center overflow-hidden pl-2 py-2.5 rounded-lg shrink-0 w-[288px]">
              <div className="flex gap-1 items-center text-[#667085]">
                <p
                  className="text-xs font-normal"
                  style={{ fontFamily: 'Roboto', lineHeight: '14.4px' }}
                >
                  {currentData.header}
                </p>
              </div>
            </div>

              {/* Suggested Items */}
              {suggestedItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(item)}
                  className={`flex gap-2.5 items-center overflow-hidden px-2 py-1.5 rounded shrink-0 w-[288px] hover:bg-gray-100 transition-colors cursor-pointer ${
                    index === 0 ? 'bg-[#f2f4f7]' : ''
                  }`}
                >
                  <div className="flex gap-1 items-start flex-1">
                    <p
                      className="text-[#465366] text-sm font-normal"
                      style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                    >
                      {item}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom Buttons - Sticky */}
            <div className="border-t border-[#eaecf0] h-10 shrink-0">
              <div className="flex h-10 items-end justify-center overflow-hidden">
                {showBrowseAll && (
                  <button
                    onClick={() => {
                      handleClose()
                      onBrowseAll()
                    }}
                    className={`w-full flex gap-1.5 h-full items-center justify-center overflow-hidden px-3 py-2 text-sm transition-colors cursor-pointer border-r border-[#eaecf0] ${
                      removeButtonBackground ? 'hover:bg-gray-100' : 'bg-[#f3f5f8] hover:bg-gray-200'
                    }`}
                  >
                    <span className="material-icons-round text-[#667085]" style={{ fontSize: '18px' }}>
                      list
                    </span>
                    <span
                      className="text-[#465366] font-normal"
                      style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                    >
                      Browse all
                    </span>
                  </button>
                )}
                <button className={`w-full flex gap-1.5 h-full items-center justify-center overflow-hidden px-3 py-2 text-sm transition-colors cursor-pointer ${
                  removeButtonBackground ? 'hover:bg-gray-100' : 'bg-[#f3f5f8] hover:bg-gray-200'
                }`}>
                  <span className="material-icons-round text-[#667085]" style={{ fontSize: '18px' }}>
                    join_left
                  </span>
                  <span
                    className="text-[#465366] font-normal"
                    style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                  >
                    Boolean
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttributeSearchBar
