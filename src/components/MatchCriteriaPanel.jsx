import { useState } from 'react'
import AttributeExplorer from './AttributeExplorer'
import AttributeSearchBar from './AttributeSearchBar'

function MatchCriteriaPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [explorerOpen, setExplorerOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchBarOpen, setSearchBarOpen] = useState(null)
  // Structure: { category: { qualifier: { mustHave: boolean, attributes: [] } } }
  const [selectedAttributes, setSelectedAttributes] = useState({})
  const [version, setVersion] = useState(2) // Version toggle: 1, 2, 3, or 4
  const [currentQualifier, setCurrentQualifier] = useState({}) // Track current qualifier per category
  const [tooltipState, setTooltipState] = useState({ visible: false, text: '', position: { x: 0, y: 0 } })

  const criteriaGroups = [
    {
      title: 'Findem Magic',
      placeholder: 'Personal Traits, DEI, etc',
      hasChevron: true,
    },
    {
      title: 'Job Title',
      placeholder: 'Current, past, or recent job title',
      hasChevron: true,
    },
    {
      title: 'Location',
      placeholder: 'Location, region, remote, etc',
      hasChevron: false,
    },
    {
      title: 'Skills',
      placeholder: 'Must-have and nice-to-have skills',
      hasChevron: false,
    },
    {
      title: 'Companies',
      placeholder: 'Companies and company lists',
      hasChevron: true,
    },
    {
      title: 'Company Attributes',
      placeholder: 'Company stage, product category, etc',
      hasChevron: true,
    },
    {
      title: 'Company Size',
      placeholder: 'Current, past, or recent size',
      hasChevron: true,
    },
    {
      title: 'Industries',
      placeholder: 'Current, past, or recent industry',
      hasChevron: true,
    },
  ]

  const handleBrowseAll = (category) => {
    setSelectedCategory(category)
    setExplorerOpen(true)
  }

  const handleCloseExplorer = () => {
    // The AttributeExplorer component will handle its own closing animation
    setExplorerOpen(false)
  }

  const handleSelectAttribute = (category, attribute) => {
    const qualifier = currentQualifier[category] || 'Current'
    setSelectedAttributes(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [qualifier]: {
          mustHave: prev[category]?.[qualifier]?.mustHave ?? true,
          attributes: [...(prev[category]?.[qualifier]?.attributes || []), attribute]
        }
      }
    }))
  }

  const handleRemoveAttribute = (category, qualifier, attributeToRemove) => {
    setSelectedAttributes(prev => {
      const updatedAttributes = prev[category][qualifier].attributes.filter(attr => attr !== attributeToRemove)
      if (updatedAttributes.length === 0) {
        const { [qualifier]: removed, ...restQualifiers } = prev[category]
        if (Object.keys(restQualifiers).length === 0) {
          const { [category]: removedCategory, ...rest } = prev
          return rest
        }
        return {
          ...prev,
          [category]: restQualifiers
        }
      }
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [qualifier]: {
            ...prev[category][qualifier],
            attributes: updatedAttributes
          }
        }
      }
    })
  }

  const handleQualifierChange = (category, newQualifier) => {
    setCurrentQualifier(prev => ({
      ...prev,
      [category]: newQualifier
    }))
  }

  const handleMustHaveChange = (category, qualifier, value) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [qualifier]: {
          ...prev[category][qualifier],
          mustHave: value === 'must-have'
        }
      }
    }))
  }

  const handleTooltipShow = (e, text) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipState({
      visible: true,
      text: text,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      }
    })
  }

  const handleTooltipHide = () => {
    setTooltipState({ visible: false, text: '', position: { x: 0, y: 0 } })
  }

  return (
    <div className="relative h-full flex border-r border-[#eaecf0]">
      {/* Match Criteria Panel */}
      <div className="flex flex-col h-full">
        {/* Section Header */}
        <div className="bg-white border-r border-b border-[#eaecf0] px-8 py-3.5 flex items-center justify-between w-[360px] shrink-0">
          <h2
            className="text-[#101828] text-base font-medium"
            style={{ fontFamily: 'Roboto', lineHeight: '26px' }}
          >
            Match Criteria
          </h2>
          {/* Version Toggle */}
          <div className="flex items-center gap-1 bg-[#f3f5f8] rounded-md p-0.5">
            {[1, 2, 3, 4].map((v) => (
              <button
                key={v}
                onClick={() => setVersion(v)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  version === v
                    ? 'bg-white text-[#101828] shadow-sm'
                    : 'text-[#667085] hover:text-[#465366]'
                }`}
                style={{ fontFamily: 'Roboto' }}
              >
                V{v}
              </button>
            ))}
          </div>
        </div>

      {/* Scrollable Content */}
      <div className="flex-1 bg-white border-r border-[#eaecf0] w-[360px] overflow-y-auto">
        {/* Version 1 */}
        {version === 1 && (
          <div className="px-8 pt-6 pb-5">
            <div className="flex flex-col gap-5 w-full">
              {criteriaGroups.map((group, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col gap-1 w-full">
                    {/* Group Header - No Browse All */}
                    <div className="flex items-center justify-between pl-1 w-full">
                      <h3
                        className="text-[#101828] text-base font-medium"
                        style={{ fontFamily: 'Roboto', lineHeight: '25.6px' }}
                      >
                        {group.title}
                      </h3>
                    </div>

                    {/* Selected Attributes - Multiple Qualifiers */}
                    {selectedAttributes[group.title] && Object.keys(selectedAttributes[group.title]).length > 0 && (
                      <div className="flex flex-col gap-4 p-1 w-full">
                        {Object.entries(selectedAttributes[group.title]).map(([qualifier, data], qualifierIndex, qualifiersArray) => (
                          <div key={qualifier} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <select
                                  value={data.mustHave ? 'must-have' : 'can-have'}
                                  onChange={(e) => handleMustHaveChange(group.title, qualifier, e.target.value)}
                                  className="appearance-none bg-[rgba(220,223,234,0.4)] text-[#101828] text-xs font-normal px-2 py-1 pr-6 rounded cursor-pointer outline-none"
                                  style={{ fontFamily: 'Roboto', lineHeight: '14.4px' }}>
                                  <option value="must-have">Must have</option>
                                  <option value="can-have">Can have</option>
                                </select>
                                <span className="material-icons-round text-[#101828] absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: '14px' }}>
                                  keyboard_arrow_down
                                </span>
                              </div>
                              <p
                                className="text-[#667085] text-xs font-normal"
                                style={{ fontFamily: 'Roboto', lineHeight: '14.4px' }}
                              >
                                {qualifier.toLowerCase()} {group.title.toLowerCase()}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {data.attributes.map((attr, attrIndex) => (
                                <div
                                  key={attrIndex}
                                  className="flex items-center gap-1 bg-[#e1efff] px-[10px] py-[4px] rounded-[16px]"
                                >
                                  <span
                                    className="text-[#0f42bc] text-sm font-normal"
                                    style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                                  >
                                    {attr}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveAttribute(group.title, qualifier, attr)}
                                    className="flex items-center justify-center hover:opacity-70 transition-opacity"
                                  >
                                    <span
                                      className="material-icons-round text-[#0f42bc]"
                                      style={{ fontSize: '16px' }}
                                    >
                                      close
                                    </span>
                                  </button>
                                </div>
                              ))}
                              {/* Add button appended to last qualifier */}
                              {qualifierIndex === qualifiersArray.length - 1 && (
                                <button
                                  onClick={() => setSearchBarOpen(group.title)}
                                  className="flex items-center justify-center w-7 h-7 rounded-full bg-[#f2f4f7] hover:bg-[#e4e7ec] transition-colors cursor-pointer"
                                >
                                  <span className="material-icons-round text-[#667085]" style={{ fontSize: '18px' }}>
                                    add
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Attribute Button - Only show when no attributes */}
                    {(!selectedAttributes[group.title] || Object.keys(selectedAttributes[group.title]).length === 0) && (
                      <div className="p-1 w-full">
                        <button
                          onClick={() => setSearchBarOpen(group.title)}
                          className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer"
                        >
                          <span
                            className="material-icons-round text-[14px]"
                            style={{ fontSize: '14px' }}
                          >
                            add
                          </span>
                          <span
                            className="font-normal"
                            style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                          >
                            {group.placeholder}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Search Bar - Centered */}
                    {searchBarOpen === group.title && (
                      <div className="flex justify-center w-full">
                        <AttributeSearchBar
                          category={group.title}
                          onClose={() => setSearchBarOpen(null)}
                          onSelect={(attribute) => handleSelectAttribute(group.title, attribute)}
                          showBrowseAll={group.hasChevron}
                          onBrowseAll={() => handleBrowseAll(group.title)}
                          removeButtonBackground={true}
                          qualifier={currentQualifier[group.title] || 'Current'}
                          onQualifierChange={(newQualifier) => handleQualifierChange(group.title, newQualifier)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Blue Indicator */}
                  {explorerOpen && selectedCategory === group.title && (
                    <div className="absolute right-[-32px] top-0 bottom-0 w-[3px] bg-[#4599fa]" />
                  )}

                  {/* Divider */}
                  {index < criteriaGroups.length - 1 && (
                    <div className="h-px bg-[#dcdfea] w-full mt-5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Version 2 */}
        {version === 2 && (
          <div className="px-8 pt-6 pb-5">
          <div className="flex flex-col gap-5 w-full">
            {criteriaGroups.map((group, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col gap-1 w-full">
                  {/* Group Header */}
                  {group.hasChevron ? (
                    <button
                      onClick={() => handleBrowseAll(group.title)}
                      className="group flex items-center justify-between px-1 py-1 w-full rounded-md border-l-2 border-l-white hover:bg-[#f2f4f7] hover:border-l-[#f2f4f7] transition-colors cursor-pointer relative"
                    >
                      <h3
                        className="text-[#101828] text-base font-medium"
                        style={{ fontFamily: 'Roboto', lineHeight: '25.6px' }}
                      >
                        {group.title}
                      </h3>
                      <div className="flex gap-1 items-center px-1 py-[3px] rounded-lg">
                        <span
                          className="text-[#465366] text-sm font-normal opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                        >
                          Browse all
                        </span>
                        <span
                          className="material-icons-round text-[#969dad]"
                          style={{ fontSize: '22px' }}
                        >
                          chevron_right
                        </span>
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between pl-1 w-full">
                      <h3
                        className="text-[#101828] text-base font-medium"
                        style={{ fontFamily: 'Roboto', lineHeight: '25.6px' }}
                      >
                        {group.title}
                      </h3>
                    </div>
                  )}

                  {/* Selected Attributes - Multiple Qualifiers */}
                  {selectedAttributes[group.title] && Object.keys(selectedAttributes[group.title]).length > 0 && (
                    <div className="flex flex-col gap-4 p-1 w-full">
                      {Object.entries(selectedAttributes[group.title]).map(([qualifier, data], qualifierIndex, qualifiersArray) => (
                        <div key={qualifier} className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <select
                                value={data.mustHave ? 'must-have' : 'can-have'}
                                onChange={(e) => handleMustHaveChange(group.title, qualifier, e.target.value)}
                                className="appearance-none bg-[rgba(220,223,234,0.4)] text-[#101828] text-xs font-normal px-2 py-1 pr-6 rounded cursor-pointer outline-none"
                                style={{ fontFamily: 'Roboto', lineHeight: '14.4px' }}>
                                <option value="must-have">Must have</option>
                                <option value="can-have">Can have</option>
                              </select>
                              <span className="material-icons-round text-[#101828] absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: '14px' }}>
                                keyboard_arrow_down
                              </span>
                            </div>
                            <p
                              className="text-[#667085] text-xs font-normal"
                              style={{ fontFamily: 'Roboto', lineHeight: '14.4px' }}
                            >
                              {qualifier.toLowerCase()} {group.title.toLowerCase()}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {data.attributes.map((attr, attrIndex) => (
                              <div
                                key={attrIndex}
                                className="flex items-center gap-1 bg-[#e1efff] px-[10px] py-[4px] rounded-[16px]"
                              >
                                <span
                                  className="text-[#0f42bc] text-sm font-normal"
                                  style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                                >
                                  {attr}
                                </span>
                                <button
                                  onClick={() => handleRemoveAttribute(group.title, qualifier, attr)}
                                  className="flex items-center justify-center hover:opacity-70 transition-opacity"
                                >
                                  <span
                                    className="material-icons-round text-[#0f42bc]"
                                    style={{ fontSize: '16px' }}
                                  >
                                    close
                                  </span>
                                </button>
                              </div>
                            ))}
                            {/* Add button appended to last qualifier */}
                            {qualifierIndex === qualifiersArray.length - 1 && (
                              <button
                                onClick={() => setSearchBarOpen(group.title)}
                                className="flex items-center justify-center w-7 h-7 rounded-full bg-[#f2f4f7] hover:bg-[#e4e7ec] transition-colors cursor-pointer"
                              >
                                <span className="material-icons-round text-[#667085]" style={{ fontSize: '18px' }}>
                                  add
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Attribute Button - Only show when no attributes */}
                  {(!selectedAttributes[group.title] || Object.keys(selectedAttributes[group.title]).length === 0) && (
                    <div className="p-1 w-full">
                      <button
                        onClick={() => setSearchBarOpen(group.title)}
                        className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer"
                      >
                        <span
                          className="material-icons-round text-[14px]"
                          style={{ fontSize: '14px' }}
                        >
                          add
                        </span>
                        <span
                          className="font-normal"
                          style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                        >
                          {group.placeholder}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Search Bar - Centered */}
                  {searchBarOpen === group.title && (
                    <div className="flex justify-center w-full">
                      <AttributeSearchBar
                        category={group.title}
                        onClose={() => setSearchBarOpen(null)}
                        onSelect={(attribute) => handleSelectAttribute(group.title, attribute)}
                        qualifier={currentQualifier[group.title] || 'Current'}
                        onQualifierChange={(newQualifier) => handleQualifierChange(group.title, newQualifier)}
                      />
                    </div>
                  )}
                </div>

                {/* Blue Indicator */}
                {explorerOpen && selectedCategory === group.title && (
                  <div className="absolute right-[-32px] top-0 bottom-0 w-[3px] bg-[#4599fa]" />
                )}

                {/* Divider */}
                {index < criteriaGroups.length - 1 && (
                  <div className="h-px bg-[#dcdfea] w-full mt-5" />
                )}
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Version 3 */}
        {version === 3 && (
          <div className="px-8 pt-6 pb-5">
            <div className="flex flex-col gap-5 w-full">
              {criteriaGroups.map((group, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col gap-1 w-full">
                    {/* Group Header - Inline Buttons */}
                    <div className="flex items-center justify-between pl-1 w-full">
                      <h3
                        className="text-[#101828] text-base font-medium"
                        style={{ fontFamily: 'Roboto', lineHeight: '25.6px' }}
                      >
                        {group.title}
                      </h3>
                      <div className="flex items-center">
                        <button
                          onClick={() => setSearchBarOpen(group.title)}
                          onMouseEnter={(e) => handleTooltipShow(e, 'Add attributes')}
                          onMouseLeave={handleTooltipHide}
                          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#f2f4f7] transition-colors cursor-pointer"
                        >
                          <span className="material-icons-round text-[#969dad]" style={{ fontSize: '18px' }}>
                            add
                          </span>
                        </button>
                        {group.hasChevron && (
                          <button
                            onClick={() => handleBrowseAll(group.title)}
                            onMouseEnter={(e) => handleTooltipShow(e, 'Browse all attributes')}
                            onMouseLeave={handleTooltipHide}
                            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#f2f4f7] transition-colors cursor-pointer"
                          >
                            <span className="material-icons-round text-[#969dad]" style={{ fontSize: '22px' }}>
                              chevron_right
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Selected Attributes - Multiple Qualifiers */}
                    {selectedAttributes[group.title] && Object.keys(selectedAttributes[group.title]).length > 0 && (
                      <div className="flex flex-col gap-4 p-1 w-full">
                        {Object.entries(selectedAttributes[group.title]).map(([qualifier, data]) => (
                          <div key={qualifier} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <select
                                  value={data.mustHave ? 'must-have' : 'can-have'}
                                  onChange={(e) => handleMustHaveChange(group.title, qualifier, e.target.value)}
                                  className="appearance-none bg-[rgba(220,223,234,0.4)] text-[#101828] text-xs font-normal px-2 py-1 pr-6 rounded cursor-pointer outline-none"
                                  style={{ fontFamily: 'Roboto', lineHeight: '14.4px' }}>
                                  <option value="must-have">Must have</option>
                                  <option value="can-have">Can have</option>
                                </select>
                                <span className="material-icons-round text-[#101828] absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: '14px' }}>
                                  keyboard_arrow_down
                                </span>
                              </div>
                              <p
                                className="text-[#667085] text-xs font-normal"
                                style={{ fontFamily: 'Roboto', lineHeight: '14.4px' }}
                              >
                                {qualifier.toLowerCase()} {group.title.toLowerCase()}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {data.attributes.map((attr, attrIndex) => (
                                <div
                                  key={attrIndex}
                                  className="flex items-center gap-1 bg-[#e1efff] px-[10px] py-[4px] rounded-[16px]"
                                >
                                  <span
                                    className="text-[#0f42bc] text-sm font-normal"
                                    style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                                  >
                                    {attr}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveAttribute(group.title, qualifier, attr)}
                                    className="flex items-center justify-center hover:opacity-70 transition-opacity"
                                  >
                                    <span
                                      className="material-icons-round text-[#0f42bc]"
                                      style={{ fontSize: '16px' }}
                                    >
                                      close
                                    </span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Search Bar */}
                    {searchBarOpen === group.title && (
                      <div className="p-1 w-full relative">
                        <div className="absolute left-1 top-0 z-30">
                          <AttributeSearchBar
                            category={group.title}
                            onClose={() => setSearchBarOpen(null)}
                            onSelect={(attribute) => handleSelectAttribute(group.title, attribute)}
                            showBrowseAll={false}
                            qualifier={currentQualifier[group.title] || 'Current'}
                            onQualifierChange={(newQualifier) => handleQualifierChange(group.title, newQualifier)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Blue Indicator */}
                  {explorerOpen && selectedCategory === group.title && (
                    <div className="absolute right-[-32px] top-0 bottom-0 w-[3px] bg-[#4599fa]" />
                  )}

                  {/* Divider */}
                  {index < criteriaGroups.length - 1 && (
                    <div className="h-px bg-[#dcdfea] w-full mt-5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Version 4 */}
        {version === 4 && (
          <div className="px-8 pt-6 pb-5">
            <div className="flex flex-col gap-5 w-full">
              {criteriaGroups.map((group, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col gap-1 w-full">
                    {/* Group Header */}
                    <div className="pl-1 w-full">
                      <h3
                        className="text-[#101828] text-base font-medium"
                        style={{ fontFamily: 'Roboto', lineHeight: '25.6px' }}
                      >
                        {group.title}
                      </h3>
                    </div>

                    {/* Selected Attributes - Multiple Qualifiers */}
                    {selectedAttributes[group.title] && Object.keys(selectedAttributes[group.title]).length > 0 && (
                      <div className="flex flex-col gap-4 p-1 w-full">
                        {Object.entries(selectedAttributes[group.title]).map(([qualifier, data]) => (
                          <div key={qualifier} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <select
                                  value={data.mustHave ? 'must-have' : 'can-have'}
                                  onChange={(e) => handleMustHaveChange(group.title, qualifier, e.target.value)}
                                  className="appearance-none bg-[rgba(220,223,234,0.4)] text-[#101828] text-xs font-normal px-2 py-1 pr-6 rounded cursor-pointer outline-none"
                                  style={{ fontFamily: 'Roboto', lineHeight: '14.4px' }}>
                                  <option value="must-have">Must have</option>
                                  <option value="can-have">Can have</option>
                                </select>
                                <span className="material-icons-round text-[#101828] absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: '14px' }}>
                                  keyboard_arrow_down
                                </span>
                              </div>
                              <p
                                className="text-[#667085] text-xs font-normal"
                                style={{ fontFamily: 'Roboto', lineHeight: '14.4px' }}
                              >
                                {qualifier.toLowerCase()} {group.title.toLowerCase()}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {data.attributes.map((attr, attrIndex) => (
                                <div
                                  key={attrIndex}
                                  className="flex items-center gap-1 bg-[#e1efff] px-[10px] py-[4px] rounded-[16px]"
                                >
                                  <span
                                    className="text-[#0f42bc] text-sm font-normal"
                                    style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                                  >
                                    {attr}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveAttribute(group.title, qualifier, attr)}
                                    className="flex items-center justify-center hover:opacity-70 transition-opacity"
                                  >
                                    <span
                                      className="material-icons-round text-[#0f42bc]"
                                      style={{ fontSize: '16px' }}
                                    >
                                      close
                                    </span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Buttons below attributes */}
                    <div className="flex items-center gap-1 pl-1">
                      <button
                        onClick={() => setSearchBarOpen(group.title)}
                        className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-[#f2f4f7] transition-colors cursor-pointer"
                      >
                        <span className="material-icons-round text-[#465366]" style={{ fontSize: '18px' }}>
                          add
                        </span>
                        <span
                          className="text-[#465366] text-sm font-normal"
                          style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                        >
                          Add
                        </span>
                      </button>
                      {group.hasChevron && (
                        <button
                          onClick={() => handleBrowseAll(group.title)}
                          className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-[#f2f4f7] transition-colors cursor-pointer"
                        >
                          <span className="material-icons-round text-[#465366]" style={{ fontSize: '18px' }}>
                            list
                          </span>
                          <span
                            className="text-[#465366] text-sm font-normal"
                            style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                          >
                            Browse all
                          </span>
                        </button>
                      )}
                    </div>

                    {/* AttributeSearchBar */}
                    {searchBarOpen === group.title && (
                      <div className="relative p-1 w-full">
                        <AttributeSearchBar
                          category={group.title}
                          onClose={() => setSearchBarOpen(null)}
                          onSelect={(attribute) => handleSelectAttribute(group.title, attribute)}
                          showBrowseAll={false}
                          qualifier={currentQualifier[group.title] || 'Current'}
                          onQualifierChange={(newQualifier) => handleQualifierChange(group.title, newQualifier)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Blue Indicator */}
                  {explorerOpen && selectedCategory === group.title && (
                    <div className="absolute right-[-32px] top-0 bottom-0 w-[3px] bg-[#4599fa]" />
                  )}

                  {/* Divider */}
                  {index < criteriaGroups.length - 1 && (
                    <div className="h-px bg-[#dcdfea] w-full mt-5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

        {/* Collapse/Expand Button */}
        {!explorerOpen && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-[13px] top-[14px] w-[26px] h-[26px] bg-white border border-[#eaecf0] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <span
              className="material-icons-round text-[#465366] text-[22px]"
              style={{ fontSize: '22px' }}
            >
              chevron_left
            </span>
          </button>
        )}
      </div>

      {/* Dark Overlay - only covers the right column */}
      {explorerOpen && (
        <div
          className="fixed left-[450px] bottom-0 right-0 z-10"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', top: '105px' }}
          onClick={() => setExplorerOpen(false)}
        />
      )}

      {/* Attribute Explorer */}
      {explorerOpen && (
        <div className="absolute left-[360px] top-[-1px] bottom-0 z-20">
          <AttributeExplorer
            category={selectedCategory}
            onClose={handleCloseExplorer}
          />
        </div>
      )}

      {/* Global Tooltip - Rendered outside overflow containers */}
      {tooltipState.visible && (
        <div
          className="fixed pointer-events-none transition-opacity z-50"
          style={{
            left: `${tooltipState.position.x}px`,
            top: `${tooltipState.position.y}px`,
            transform: 'translate(-50%, -100%)',
            fontFamily: 'Roboto'
          }}
        >
          <div className="px-[10px] py-[6px] rounded-lg whitespace-nowrap" style={{ backgroundColor: '#101828', boxShadow: '0px 4px 8px 0px rgba(25, 24, 35, 0.15)' }}>
            <p className="text-white text-xs font-normal leading-[18px]">{tooltipState.text}</p>
          </div>
          <div className="w-0 h-0 border-l-[7.5px] border-r-[7.5px] border-t-[8px] border-l-transparent border-r-transparent mx-auto" style={{ borderTopColor: '#101828' }}></div>
        </div>
      )}
    </div>
  )
}

export default MatchCriteriaPanel
