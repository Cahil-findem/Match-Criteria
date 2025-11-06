import { useState, useRef, useEffect } from 'react'
import AttributeExplorer from './AttributeExplorer'
import AttributeSearchBar from './AttributeSearchBar'
import BooleanSkillsDisplay from './BooleanSkillsDisplay'
import BooleanSkillsModal from './BooleanSkillsModal'

function MatchCriteriaPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [explorerOpen, setExplorerOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchBarOpen, setSearchBarOpen] = useState(null)
  // Structure for V1-V3: { category: { qualifier: { mustHave: boolean, attributes: [] } } }
  const [selectedAttributes, setSelectedAttributes] = useState({})
  // Structure for Overhall (5): { category: { priority: [{ attr, timeQualifier }] } }
  // where priority is 'must-have', 'can-have', or 'excluded'
  const [selectedAttributesV5, setSelectedAttributesV5] = useState({})
  const [version, setVersion] = useState(1) // Version toggle: 1, 2, 3, 4, 5 (Overhall), or 6 (Boolean)
  const [currentQualifier, setCurrentQualifier] = useState({}) // Track current time qualifier per category for V1-V4 (Current/Past/Recent)
  const [currentPriorityV5, setCurrentPriorityV5] = useState({}) // Track current priority qualifier per category for V5 (must-have/can-have/excluded)
  const [currentTimeQualifier, setCurrentTimeQualifier] = useState({}) // Track current time qualifier per category for V5
  const [categoryMustHave, setCategoryMustHave] = useState({}) // Track Must Have toggle per category (V1-V3)
  const [tooltipState, setTooltipState] = useState({ visible: false, text: '', position: { x: 0, y: 0 } })
  const [chipMenuOpen, setChipMenuOpen] = useState(null) // Track which chip menu is open
  // Structure for Boolean Skills (V4): { category: { qualifier: { orGroups: [[skill1, skill2], [skill3]] } } }
  const [booleanSkills, setBooleanSkills] = useState({})
  const [booleanModalOpen, setBooleanModalOpen] = useState(false)
  const [booleanModalCategory, setBooleanModalCategory] = useState(null)

  const criteriaGroups = [
    {
      title: 'Job Title',
      placeholder: 'Job titles or boolean',
      hasChevron: true,
    },
    {
      title: 'Findem Magic',
      placeholder: 'Personal Traits, DEI, etc',
      hasChevron: true,
    },
    {
      title: 'Location',
      placeholder: 'Location, region, remote, etc',
      hasChevron: false,
    },
    {
      title: 'Skills',
      placeholder: 'Skills or boolean',
      hasChevron: false,
    },
    {
      title: 'Companies',
      placeholder: 'Companies, company lists, or boolean',
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

  // Helper function to determine if a category should show the Boolean button
  const shouldShowBoolean = (category) => {
    return ['Job Title', 'Skills', 'Companies', 'Company Size'].includes(category)
  }

  // Close chip dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (chipMenuOpen) {
        // Check if the click is outside any dropdown menu
        const dropdowns = document.querySelectorAll('[data-chip-dropdown]')
        let clickedOutside = true

        dropdowns.forEach(dropdown => {
          if (dropdown.contains(event.target)) {
            clickedOutside = false
          }
        })

        // Also check if clicked on the menu button itself
        const menuButtons = document.querySelectorAll('[data-chip-menu-button]')
        menuButtons.forEach(button => {
          if (button.contains(event.target)) {
            clickedOutside = false
          }
        })

        if (clickedOutside) {
          setChipMenuOpen(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [chipMenuOpen])

  const handleBrowseAll = (category) => {
    setSelectedCategory(category)
    setExplorerOpen(true)
  }

  const handleCloseExplorer = () => {
    // The AttributeExplorer component will handle its own closing animation
    setExplorerOpen(false)
  }

  const handleSelectAttribute = (category, attribute) => {
    // V6: Check if this is "Insert boolean string" for Skills
    if (version === 6 && category === 'Skills' && attribute === 'Insert boolean string') {
      setBooleanModalCategory(category)
      setBooleanModalOpen(true)
      setSearchBarOpen(null)
      return
    }

    if (version === 5) {
      // V5: Use priority qualifier (must-have/can-have/excluded) and separate time qualifier
      const priority = currentPriorityV5[category] || 'must-have'
      const timeQualifier = currentTimeQualifier[category] || 'Current'

      setSelectedAttributesV5(prev => ({
        ...prev,
        [category]: {
          ...(prev[category] || {}),
          [priority]: [
            ...(prev[category]?.[priority] || []),
            { attr: attribute, timeQualifier: timeQualifier }
          ]
        }
      }))
    } else {
      // V1-V3 and V4: Use the old structure
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

  // V5: Remove attribute from a priority subsection
  const handleRemoveAttributeV5 = (category, priority, attributeToRemove) => {
    setSelectedAttributesV5(prev => {
      const updatedItems = prev[category][priority].filter(item => item.attr !== attributeToRemove)

      if (updatedItems.length === 0) {
        // Remove the priority subsection if empty
        const { [priority]: removed, ...restPriorities } = prev[category]
        if (Object.keys(restPriorities).length === 0) {
          // Remove the category if empty
          const { [category]: removedCategory, ...rest } = prev
          return rest
        }
        return {
          ...prev,
          [category]: restPriorities
        }
      }

      return {
        ...prev,
        [category]: {
          ...prev[category],
          [priority]: updatedItems
        }
      }
    })
  }

  // V5: Change priority of an attribute (move between Must Have/Can Have/Excluded)
  const handleAttributePriorityChangeV5 = (category, currentPriority, attribute, timeQualifier, newPriority) => {
    setSelectedAttributesV5(prev => {
      // Remove from current priority
      const updatedCurrentItems = prev[category][currentPriority].filter(item => item.attr !== attribute)

      let newCategoryData = { ...prev[category] }

      if (updatedCurrentItems.length === 0) {
        const { [currentPriority]: removed, ...rest } = newCategoryData
        newCategoryData = rest
      } else {
        newCategoryData[currentPriority] = updatedCurrentItems
      }

      // Add to new priority
      newCategoryData[newPriority] = [
        ...(newCategoryData[newPriority] || []),
        { attr: attribute, timeQualifier: timeQualifier }
      ]

      return {
        ...prev,
        [category]: newCategoryData
      }
    })
  }

  // V5: Change time qualifier of an attribute (Current/Past/Recent)
  const handleAttributeTimeChangeV5 = (category, priority, attribute, newTimeQualifier) => {
    setSelectedAttributesV5(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [priority]: prev[category][priority].map(item =>
          item.attr === attribute
            ? { ...item, timeQualifier: newTimeQualifier }
            : item
        )
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

  const handleBooleanSkillsApply = (booleanData) => {
    const category = booleanModalCategory
    const qualifier = currentQualifier[category] || 'Current'

    setBooleanSkills(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [qualifier]: booleanData
      }
    }))
  }

  const handleBooleanSkillsUpdate = (category, qualifier, booleanData) => {
    setBooleanSkills(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [qualifier]: booleanData
      }
    }))
  }

  const handleBooleanSkillsRemove = (category, qualifier) => {
    setBooleanSkills(prev => {
      const { [qualifier]: removed, ...restQualifiers } = prev[category] || {}
      if (Object.keys(restQualifiers).length === 0) {
        const { [category]: removedCategory, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [category]: restQualifiers
      }
    })
  }

  const handleBooleanClick = (category) => {
    setBooleanModalCategory(category)
    setBooleanModalOpen(true)
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
          {/* Version Dropdown */}
          <div className="relative">
            <select
              value={version}
              onChange={(e) => setVersion(Number(e.target.value))}
              className="appearance-none bg-[#f9fafb] border border-[#eaecf0] rounded-lg pl-3 pr-8 py-1.5 text-[#667085] text-sm font-normal outline-none hover:bg-[#f3f5f8] focus:border-[#d0d5dd] focus:bg-white cursor-pointer transition-colors"
              style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
            >
              <option value={1}>Version 1</option>
              <option value={2}>Version 2</option>
              <option value={3}>Version 3</option>
              <option value={4}>Version 4</option>
              <option value={5}>Overhall</option>
              <option value={6}>Boolean</option>
            </select>
            <span className="material-icons-round text-[#969dad] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: '18px' }}>
              expand_more
            </span>
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
                      <div className="flex flex-col gap-4 px-1 pt-1 pb-1.5 w-full">
                        {Object.entries(selectedAttributes[group.title])
                          .sort(([a], [b]) => {
                            const order = ['Current', 'Recent', 'Past']
                            return order.indexOf(a) - order.indexOf(b)
                          })
                          .map(([qualifier, data], qualifierIndex, qualifiersArray) => (
                          <div key={qualifier} className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <p
                                className="text-[#667085] text-sm font-normal"
                                style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                              >
                                {qualifier}
                              </p>
                              {/* Toggle Switch */}
                              <button
                                onClick={() => handleMustHaveChange(group.title, qualifier, data.mustHave ? 'can-have' : 'must-have')}
                                onMouseEnter={(e) => handleTooltipShow(e, data.mustHave ? 'Turn off to make section Nice-to-Have' : 'Turn on to make section Must-Have')}
                                onMouseLeave={handleTooltipHide}
                                className="relative w-[19.5px] h-[9.75px] rounded-full transition-colors cursor-pointer self-center mr-1.5"
                                style={{ backgroundColor: data.mustHave ? '#4599FA' : '#E4E7EC' }}
                              >
                                <div
                                  className="absolute top-[0.7px] w-[8.36px] h-[8.36px] bg-white rounded-full transition-transform"
                                  style={{
                                    transform: data.mustHave ? 'translateX(10.45px)' : 'translateX(0.7px)'
                                  }}
                                />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {data.attributes.map((attr, attrIndex) => (
                                <div
                                  key={attrIndex}
                                  className="flex items-center gap-1 bg-[#e1efff] px-[10px] py-[4px] rounded-[16px]"
                                >
                                  <span
                                    className="material-icons-round text-[#0f42bc]"
                                    style={{ fontSize: '14px' }}
                                  >
                                    star
                                  </span>
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

                    {/* Add Button / Search Bar Container */}
                    <div className="relative w-full h-[38px]">
                      {/* Add Attribute Button - Always show below attributes */}
                      {selectedAttributes[group.title] && Object.keys(selectedAttributes[group.title]).length > 0 && searchBarOpen !== group.title && (
                        <button
                          onClick={() => setSearchBarOpen(group.title)}
                          className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer w-full px-1 py-1 rounded-md border-l-2 border-l-white hover:bg-[#f2f4f7] hover:border-l-[#f2f4f7]"
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
                      )}

                      {/* Add Attribute Button - Only show when no attributes */}
                      {(!selectedAttributes[group.title] || Object.keys(selectedAttributes[group.title]).length === 0) && searchBarOpen !== group.title && (
                        <button
                          onClick={() => setSearchBarOpen(group.title)}
                          className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer w-full px-1 py-1 rounded-md border-l-2 border-l-white hover:bg-[#f2f4f7] hover:border-l-[#f2f4f7]"
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
                      )}

                      {/* Search Bar - Centered */}
                      {searchBarOpen === group.title && (
                        <div className="absolute top-0 left-0 right-0 flex justify-center w-full z-10">
                          <AttributeSearchBar
                            category={group.title}
                            onClose={() => setSearchBarOpen(null)}
                            onSelect={(attribute) => handleSelectAttribute(group.title, attribute)}
                            showBrowseAll={group.hasChevron}
                            onBrowseAll={() => handleBrowseAll(group.title)}
                            removeButtonBackground={true}
                            qualifier={currentQualifier[group.title] || 'Current'}
                            onQualifierChange={(newQualifier) => handleQualifierChange(group.title, newQualifier)}
                            showBoolean={shouldShowBoolean(group.title)}
                            onBooleanClick={() => handleBooleanClick(group.title)}
                            version={version}
                          />
                        </div>
                      )}
                    </div>
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
                          className="text-[#969dad] text-sm font-normal"
                          style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                        >
                          Browse
                        </span>
                        <span
                          className="material-icons-round text-[#969dad]"
                          style={{ fontSize: '24px' }}
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
                    <div className="flex flex-col gap-4 px-1 pt-1 pb-1.5 w-full">
                      {Object.entries(selectedAttributes[group.title])
                        .sort(([a], [b]) => {
                          const order = ['Current', 'Recent', 'Past']
                          return order.indexOf(a) - order.indexOf(b)
                        })
                        .map(([qualifier, data], qualifierIndex, qualifiersArray) => (
                        <div key={qualifier} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <p
                              className="text-[#667085] text-sm font-normal"
                              style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                            >
                              {qualifier}
                            </p>
                            {/* Toggle Switch */}
                            <button
                              onClick={() => handleMustHaveChange(group.title, qualifier, data.mustHave ? 'can-have' : 'must-have')}
                              onMouseEnter={(e) => handleTooltipShow(e, data.mustHave ? 'Turn off to make section Nice-to-Have' : 'Turn on to make section Must-Have')}
                              onMouseLeave={handleTooltipHide}
                              className="relative w-[19.5px] h-[9.75px] rounded-full transition-colors cursor-pointer self-center mr-1.5"
                              style={{ backgroundColor: data.mustHave ? '#4599FA' : '#E4E7EC' }}
                            >
                              <div
                                className="absolute top-[0.7px] w-[8.36px] h-[8.36px] bg-white rounded-full transition-transform"
                                style={{
                                  transform: data.mustHave ? 'translateX(10.45px)' : 'translateX(0.7px)'
                                }}
                              />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {data.attributes.map((attr, attrIndex) => (
                              <div
                                key={attrIndex}
                                className="flex items-center gap-1 bg-[#e1efff] px-[10px] py-[4px] rounded-[16px]"
                              >
                                <span
                                  className="material-icons-round text-[#0f42bc]"
                                  style={{ fontSize: '14px' }}
                                >
                                  star
                                </span>
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

                  {/* Add Button / Search Bar Container */}
                  <div className="relative w-full h-[38px]">
                    {/* Add Attribute Button - Always show below attributes */}
                    {selectedAttributes[group.title] && Object.keys(selectedAttributes[group.title]).length > 0 && searchBarOpen !== group.title && (
                      <button
                        onClick={() => setSearchBarOpen(group.title)}
                        className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer w-full px-1 py-1 rounded-md border-l-2 border-l-white hover:bg-[#f2f4f7] hover:border-l-[#f2f4f7]"
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
                    )}

                    {/* Add Attribute Button - Only show when no attributes */}
                    {(!selectedAttributes[group.title] || Object.keys(selectedAttributes[group.title]).length === 0) && searchBarOpen !== group.title && (
                      <button
                        onClick={() => setSearchBarOpen(group.title)}
                        className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer w-full px-1 py-1 rounded-md border-l-2 border-l-white hover:bg-[#f2f4f7] hover:border-l-[#f2f4f7]"
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
                    )}

                    {/* Search Bar - Centered */}
                    {searchBarOpen === group.title && (
                      <div className="absolute top-0 left-0 right-0 flex justify-center w-full z-10">
                        <AttributeSearchBar
                          category={group.title}
                          onClose={() => setSearchBarOpen(null)}
                          onSelect={(attribute) => handleSelectAttribute(group.title, attribute)}
                          qualifier={currentQualifier[group.title] || 'Current'}
                          onQualifierChange={(newQualifier) => handleQualifierChange(group.title, newQualifier)}
                          showBoolean={shouldShowBoolean(group.title)}
                          version={version}
                        />
                      </div>
                    )}
                  </div>
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
                          style={{ fontSize: '24px' }}
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
                    <div className="flex flex-col gap-4 px-1 pt-1 pb-1.5 w-full">
                      {Object.entries(selectedAttributes[group.title])
                        .sort(([a], [b]) => {
                          const order = ['Current', 'Recent', 'Past']
                          return order.indexOf(a) - order.indexOf(b)
                        })
                        .map(([qualifier, data], qualifierIndex, qualifiersArray) => (
                        <div key={qualifier} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <p
                              className="text-[#667085] text-sm font-normal"
                              style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                            >
                              {qualifier}
                            </p>
                            {/* Toggle Switch */}
                            <button
                              onClick={() => handleMustHaveChange(group.title, qualifier, data.mustHave ? 'can-have' : 'must-have')}
                              onMouseEnter={(e) => handleTooltipShow(e, data.mustHave ? 'Turn off to make section Nice-to-Have' : 'Turn on to make section Must-Have')}
                              onMouseLeave={handleTooltipHide}
                              className="relative w-[19.5px] h-[9.75px] rounded-full transition-colors cursor-pointer self-center mr-1.5"
                              style={{ backgroundColor: data.mustHave ? '#4599FA' : '#E4E7EC' }}
                            >
                              <div
                                className="absolute top-[0.7px] w-[8.36px] h-[8.36px] bg-white rounded-full transition-transform"
                                style={{
                                  transform: data.mustHave ? 'translateX(10.45px)' : 'translateX(0.7px)'
                                }}
                              />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {data.attributes.map((attr, attrIndex) => (
                              <div
                                key={attrIndex}
                                className="flex items-center gap-1 bg-[#e1efff] px-[10px] py-[4px] rounded-[16px]"
                              >
                                <span
                                  className="material-icons-round text-[#0f42bc]"
                                  style={{ fontSize: '14px' }}
                                >
                                  star
                                </span>
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

                  {/* Add Button / Search Bar Container */}
                  <div className="relative w-full h-[38px]">
                    {/* Add Attribute Button - Always show below attributes */}
                    {selectedAttributes[group.title] && Object.keys(selectedAttributes[group.title]).length > 0 && searchBarOpen !== group.title && (
                      <button
                        onClick={() => setSearchBarOpen(group.title)}
                        className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer w-full px-1 py-1 rounded-md border-l-2 border-l-white hover:bg-[#f2f4f7] hover:border-l-[#f2f4f7]"
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
                    )}

                    {/* Add Attribute Button - Only show when no attributes */}
                    {(!selectedAttributes[group.title] || Object.keys(selectedAttributes[group.title]).length === 0) && searchBarOpen !== group.title && (
                      <button
                        onClick={() => setSearchBarOpen(group.title)}
                        className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer w-full px-1 py-1 rounded-md border-l-2 border-l-white hover:bg-[#f2f4f7] hover:border-l-[#f2f4f7]"
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
                    )}

                    {/* Search Bar - Centered */}
                    {searchBarOpen === group.title && (
                      <div className="absolute top-0 left-0 right-0 flex justify-center w-full z-10">
                        <AttributeSearchBar
                          category={group.title}
                          onClose={() => setSearchBarOpen(null)}
                          onSelect={(attribute) => handleSelectAttribute(group.title, attribute)}
                          qualifier={currentQualifier[group.title] || 'Current'}
                          onQualifierChange={(newQualifier) => handleQualifierChange(group.title, newQualifier)}
                          showBoolean={shouldShowBoolean(group.title)}
                          version={version}
                        />
                      </div>
                    )}
                  </div>
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
                          style={{ fontSize: '18px' }}
                        >
                          search
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
                    <div className="flex flex-col gap-4 px-1 pt-1 pb-1.5 w-full">
                      {Object.entries(selectedAttributes[group.title])
                        .sort(([a], [b]) => {
                          const order = ['Current', 'Recent', 'Past']
                          return order.indexOf(a) - order.indexOf(b)
                        })
                        .map(([qualifier, data], qualifierIndex, qualifiersArray) => (
                        <div key={qualifier} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <p
                              className="text-[#667085] text-sm font-normal"
                              style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                            >
                              {qualifier}
                            </p>
                            {/* Toggle Switch */}
                            <button
                              onClick={() => handleMustHaveChange(group.title, qualifier, data.mustHave ? 'can-have' : 'must-have')}
                              onMouseEnter={(e) => handleTooltipShow(e, data.mustHave ? 'Turn off to make section Nice-to-Have' : 'Turn on to make section Must-Have')}
                              onMouseLeave={handleTooltipHide}
                              className="relative w-[19.5px] h-[9.75px] rounded-full transition-colors cursor-pointer self-center mr-1.5"
                              style={{ backgroundColor: data.mustHave ? '#4599FA' : '#E4E7EC' }}
                            >
                              <div
                                className="absolute top-[0.7px] w-[8.36px] h-[8.36px] bg-white rounded-full transition-transform"
                                style={{
                                  transform: data.mustHave ? 'translateX(10.45px)' : 'translateX(0.7px)'
                                }}
                              />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {data.attributes.map((attr, attrIndex) => (
                              <div
                                key={attrIndex}
                                className="flex items-center gap-1 bg-[#e1efff] px-[10px] py-[4px] rounded-[16px]"
                              >
                                <span
                                  className="material-icons-round text-[#0f42bc]"
                                  style={{ fontSize: '14px' }}
                                >
                                  star
                                </span>
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

                  {/* Add Button / Search Bar Container */}
                  <div className="relative w-full h-[38px]">
                    {/* Add Attribute Button - Always show below attributes */}
                    {selectedAttributes[group.title] && Object.keys(selectedAttributes[group.title]).length > 0 && searchBarOpen !== group.title && (
                      <button
                        onClick={() => setSearchBarOpen(group.title)}
                        className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer w-full px-1 py-1 rounded-md border-l-2 border-l-white hover:bg-[#f2f4f7] hover:border-l-[#f2f4f7]"
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
                    )}

                    {/* Add Attribute Button - Only show when no attributes */}
                    {(!selectedAttributes[group.title] || Object.keys(selectedAttributes[group.title]).length === 0) && searchBarOpen !== group.title && (
                      <button
                        onClick={() => setSearchBarOpen(group.title)}
                        className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer w-full px-1 py-1 rounded-md border-l-2 border-l-white hover:bg-[#f2f4f7] hover:border-l-[#f2f4f7]"
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
                    )}

                    {/* Search Bar - Centered */}
                    {searchBarOpen === group.title && (
                      <div className="absolute top-0 left-0 right-0 flex justify-center w-full z-10">
                        <AttributeSearchBar
                          category={group.title}
                          onClose={() => setSearchBarOpen(null)}
                          onSelect={(attribute) => handleSelectAttribute(group.title, attribute)}
                          qualifier={currentQualifier[group.title] || 'Current'}
                          onQualifierChange={(newQualifier) => handleQualifierChange(group.title, newQualifier)}
                          showBoolean={shouldShowBoolean(group.title)}
                          version={version}
                        />
                      </div>
                    )}
                  </div>
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

        {/* Boolean (Version 6) */}
        {version === 6 && (
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
                          style={{ fontSize: '24px' }}
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

                  {/* Boolean Skills Display - Only for Skills category */}
                  {group.title === 'Skills' && booleanSkills[group.title] && Object.keys(booleanSkills[group.title]).length > 0 && (
                    <div className="flex flex-col gap-4 w-full">
                      {Object.entries(booleanSkills[group.title])
                        .sort(([a], [b]) => {
                          const order = ['Current', 'Recent', 'Past']
                          return order.indexOf(a) - order.indexOf(b)
                        })
                        .map(([qualifier, booleanData]) => (
                          <BooleanSkillsDisplay
                            key={qualifier}
                            booleanData={booleanData}
                            qualifier={qualifier}
                            onUpdate={(newData) => handleBooleanSkillsUpdate(group.title, qualifier, newData)}
                            onRemove={() => handleBooleanSkillsRemove(group.title, qualifier)}
                          />
                        ))
                      }
                    </div>
                  )}

                  {/* Selected Attributes - Multiple Qualifiers */}
                  {selectedAttributes[group.title] && Object.keys(selectedAttributes[group.title]).length > 0 && (
                    <div className="flex flex-col gap-4 px-1 pt-1 pb-1.5 w-full">
                      {Object.entries(selectedAttributes[group.title])
                        .sort(([a], [b]) => {
                          const order = ['Current', 'Recent', 'Past']
                          return order.indexOf(a) - order.indexOf(b)
                        })
                        .map(([qualifier, data], qualifierIndex, qualifiersArray) => (
                        <div key={qualifier} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <p
                              className="text-[#667085] text-sm font-normal"
                              style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                            >
                              {qualifier}
                            </p>
                            {/* Toggle Switch */}
                            <button
                              onClick={() => handleMustHaveChange(group.title, qualifier, data.mustHave ? 'can-have' : 'must-have')}
                              onMouseEnter={(e) => handleTooltipShow(e, data.mustHave ? 'Turn off to make section Nice-to-Have' : 'Turn on to make section Must-Have')}
                              onMouseLeave={handleTooltipHide}
                              className="relative w-[19.5px] h-[9.75px] rounded-full transition-colors cursor-pointer self-center mr-1.5"
                              style={{ backgroundColor: data.mustHave ? '#4599FA' : '#E4E7EC' }}
                            >
                              <div
                                className="absolute top-[0.7px] w-[8.36px] h-[8.36px] bg-white rounded-full transition-transform"
                                style={{
                                  transform: data.mustHave ? 'translateX(10.45px)' : 'translateX(0.7px)'
                                }}
                              />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {data.attributes.map((attr, attrIndex) => (
                              <div
                                key={attrIndex}
                                className="flex items-center gap-1 bg-[#e1efff] px-[10px] py-[4px] rounded-[16px]"
                              >
                                <span
                                  className="material-icons-round text-[#0f42bc]"
                                  style={{ fontSize: '14px' }}
                                >
                                  star
                                </span>
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

                  {/* Add Button / Search Bar Container */}
                  <div className="relative w-full h-[38px]">
                    {/* Add Attribute Button - Always show below attributes */}
                    {selectedAttributes[group.title] && Object.keys(selectedAttributes[group.title]).length > 0 && searchBarOpen !== group.title && (
                      <button
                        onClick={() => setSearchBarOpen(group.title)}
                        className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer w-full px-1 py-1 rounded-md border-l-2 border-l-white hover:bg-[#f2f4f7] hover:border-l-[#f2f4f7]"
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
                    )}

                    {/* Add Attribute Button - Only show when no attributes */}
                    {(!selectedAttributes[group.title] || Object.keys(selectedAttributes[group.title]).length === 0) && searchBarOpen !== group.title && (
                      <button
                        onClick={() => setSearchBarOpen(group.title)}
                        className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer w-full px-1 py-1 rounded-md border-l-2 border-l-white hover:bg-[#f2f4f7] hover:border-l-[#f2f4f7]"
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
                    )}

                    {/* Search Bar - Centered */}
                    {searchBarOpen === group.title && (
                      <div className="absolute top-0 left-0 right-0 flex justify-center w-full z-10">
                        <AttributeSearchBar
                          category={group.title}
                          onClose={() => setSearchBarOpen(null)}
                          onSelect={(attribute) => handleSelectAttribute(group.title, attribute)}
                          qualifier={currentQualifier[group.title] || 'Current'}
                          onQualifierChange={(newQualifier) => handleQualifierChange(group.title, newQualifier)}
                          showBoolean={shouldShowBoolean(group.title)}
                          version={version}
                        />
                      </div>
                    )}
                  </div>
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

        {/* Overhall */}
        {version === 5 && (
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
                          className="material-icons-round text-[#969dad] group-hover:text-[#465366] transition-colors"
                          style={{ fontSize: '24px' }}
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

                  {/* Selected Attributes - V5 Structure with Three Subsections */}
                  {selectedAttributesV5[group.title] && Object.keys(selectedAttributesV5[group.title]).length > 0 && (
                    <div className="flex flex-col gap-4 p-1 w-full">
                      {/* Must Have Subsection */}
                      {selectedAttributesV5[group.title]['must-have'] && selectedAttributesV5[group.title]['must-have'].length > 0 && (
                        <div className="flex flex-col gap-2">
                          <p
                            className="text-[#667085] text-sm font-normal"
                            style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                          >
                            Must Have
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedAttributesV5[group.title]['must-have'].map((item, attrIndex) => (
                              <div
                                key={attrIndex}
                                className="group relative flex items-center gap-1 bg-[#e1efff] hover:bg-[#cce4ff] px-[10px] py-[4px] rounded-[16px] transition-colors"
                              >
                                <span
                                  className="material-icons-round text-[#0f42bc]"
                                  style={{ fontSize: '14px' }}
                                >
                                  star
                                </span>
                                <span
                                  className="text-[#0f42bc] text-sm font-normal"
                                  style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                                >
                                  {item.attr} · {item.timeQualifier}
                                </span>
                                <div className="absolute right-[10px] flex items-center gap-1.5 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-[#cce4ff] group-hover:to-[#cce4ff] pl-10 transition-colors">
                                  <button
                                    data-chip-menu-button
                                    onClick={() => {
                                      const menuKey = `${group.title}-must-have-${item.attr}`
                                      setChipMenuOpen(chipMenuOpen === menuKey ? null : menuKey)
                                    }}
                                    className="flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 ease-in-out cursor-pointer"
                                  >
                                    <span
                                      className="material-icons-round text-[#0f42bc]"
                                      style={{ fontSize: '16px' }}
                                    >
                                      more_vert
                                    </span>
                                  </button>
                                  <div className="w-px h-5 bg-[#0f42bc] opacity-0 group-hover:opacity-30 transition-opacity duration-200 ease-in-out"></div>
                                  <button
                                    onClick={() => handleRemoveAttributeV5(group.title, 'must-have', item.attr)}
                                    className="flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 ease-in-out cursor-pointer"
                                  >
                                    <span
                                      className="material-icons-round text-[#0f42bc]"
                                      style={{ fontSize: '16px' }}
                                    >
                                      close
                                    </span>
                                  </button>
                                </div>

                                {/* Dropdown Menu */}
                                {chipMenuOpen === `${group.title}-must-have-${item.attr}` && (
                                  <div data-chip-dropdown className="absolute top-full left-0 mt-1 bg-white border border-[#eaecf0] rounded-lg shadow-lg py-2 w-[200px] z-50">
                                    <div className="px-3 py-1">
                                      <p className="text-[#667085] text-xs font-medium" style={{ fontFamily: 'Roboto' }}>Priority</p>
                                    </div>
                                    <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer">
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Must Have</span>
                                      <span className="material-icons-round text-[#4599fa]" style={{ fontSize: '18px' }}>check</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAttributePriorityChangeV5(group.title, 'must-have', item.attr, item.timeQualifier, 'can-have')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Can Have</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAttributePriorityChangeV5(group.title, 'must-have', item.attr, item.timeQualifier, 'excluded')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Exclude</span>
                                    </button>

                                    <div className="h-px bg-[#eaecf0] my-2"></div>

                                    <div className="px-3 py-1">
                                      <p className="text-[#667085] text-xs font-medium" style={{ fontFamily: 'Roboto' }}>Preferences</p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        handleAttributeTimeChangeV5(group.title, 'must-have', item.attr, 'Current or Past')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Current or Past</span>
                                      {item.timeQualifier === 'Current or Past' && <span className="material-icons-round text-[#4599fa]" style={{ fontSize: '18px' }}>check</span>}
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAttributeTimeChangeV5(group.title, 'must-have', item.attr, 'Current')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Current</span>
                                      {item.timeQualifier === 'Current' && <span className="material-icons-round text-[#4599fa]" style={{ fontSize: '18px' }}>check</span>}
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAttributeTimeChangeV5(group.title, 'must-have', item.attr, 'Past')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Past</span>
                                      {item.timeQualifier === 'Past' && <span className="material-icons-round text-[#4599fa]" style={{ fontSize: '18px' }}>check</span>}
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Can Have Subsection */}
                      {selectedAttributesV5[group.title]['can-have'] && selectedAttributesV5[group.title]['can-have'].length > 0 && (
                        <div className="flex flex-col gap-2">
                          <p
                            className="text-[#667085] text-sm font-normal"
                            style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                          >
                            Can Have
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedAttributesV5[group.title]['can-have'].map((item, attrIndex) => (
                              <div
                                key={attrIndex}
                                className="group relative flex items-center gap-1 bg-[#e1efff] hover:bg-[#cce4ff] px-[10px] py-[4px] rounded-[16px] transition-colors"
                              >
                                <span
                                  className="material-icons-round text-[#0f42bc]"
                                  style={{ fontSize: '14px' }}
                                >
                                  star
                                </span>
                                <span
                                  className="text-[#0f42bc] text-sm font-normal"
                                  style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                                >
                                  {item.attr} · {item.timeQualifier}
                                </span>
                                <div className="absolute right-[10px] flex items-center gap-1.5 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-[#cce4ff] group-hover:to-[#cce4ff] pl-10 transition-colors">
                                  <button
                                    data-chip-menu-button
                                    onClick={() => {
                                      const menuKey = `${group.title}-can-have-${item.attr}`
                                      setChipMenuOpen(chipMenuOpen === menuKey ? null : menuKey)
                                    }}
                                    className="flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 ease-in-out cursor-pointer"
                                  >
                                    <span
                                      className="material-icons-round text-[#0f42bc]"
                                      style={{ fontSize: '16px' }}
                                    >
                                      more_vert
                                    </span>
                                  </button>
                                  <div className="w-px h-5 bg-[#0f42bc] opacity-0 group-hover:opacity-30 transition-opacity duration-200 ease-in-out"></div>
                                  <button
                                    onClick={() => handleRemoveAttributeV5(group.title, 'can-have', item.attr)}
                                    className="flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 ease-in-out cursor-pointer"
                                  >
                                    <span
                                      className="material-icons-round text-[#0f42bc]"
                                      style={{ fontSize: '16px' }}
                                    >
                                      close
                                    </span>
                                  </button>
                                </div>

                                {/* Dropdown Menu */}
                                {chipMenuOpen === `${group.title}-can-have-${item.attr}` && (
                                  <div data-chip-dropdown className="absolute top-full left-0 mt-1 bg-white border border-[#eaecf0] rounded-lg shadow-lg py-2 w-[200px] z-50">
                                    <div className="px-3 py-1">
                                      <p className="text-[#667085] text-xs font-medium" style={{ fontFamily: 'Roboto' }}>Priority</p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        handleAttributePriorityChangeV5(group.title, 'can-have', item.attr, item.timeQualifier, 'must-have')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Must Have</span>
                                    </button>
                                    <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors">
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Can Have</span>
                                      <span className="material-icons-round text-[#4599fa]" style={{ fontSize: '18px' }}>check</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAttributePriorityChangeV5(group.title, 'can-have', item.attr, item.timeQualifier, 'excluded')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Exclude</span>
                                    </button>

                                    <div className="h-px bg-[#eaecf0] my-2"></div>

                                    <div className="px-3 py-1">
                                      <p className="text-[#667085] text-xs font-medium" style={{ fontFamily: 'Roboto' }}>Preferences</p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        handleAttributeTimeChangeV5(group.title, 'can-have', item.attr, 'Current or Past')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Current or Past</span>
                                      {item.timeQualifier === 'Current or Past' && <span className="material-icons-round text-[#4599fa]" style={{ fontSize: '18px' }}>check</span>}
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAttributeTimeChangeV5(group.title, 'can-have', item.attr, 'Current')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Current</span>
                                      {item.timeQualifier === 'Current' && <span className="material-icons-round text-[#4599fa]" style={{ fontSize: '18px' }}>check</span>}
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAttributeTimeChangeV5(group.title, 'can-have', item.attr, 'Past')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Past</span>
                                      {item.timeQualifier === 'Past' && <span className="material-icons-round text-[#4599fa]" style={{ fontSize: '18px' }}>check</span>}
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Excluded Subsection */}
                      {selectedAttributesV5[group.title]['excluded'] && selectedAttributesV5[group.title]['excluded'].length > 0 && (
                        <div className="flex flex-col gap-2">
                          <p
                            className="text-[#667085] text-sm font-normal"
                            style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                          >
                            Exclude
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedAttributesV5[group.title]['excluded'].map((item, attrIndex) => (
                              <div
                                key={attrIndex}
                                className="group relative flex items-center gap-1 bg-[#e1efff] hover:bg-[#cce4ff] px-[10px] py-[4px] rounded-[16px] transition-colors"
                              >
                                <span
                                  className="material-icons-round text-[#0f42bc]"
                                  style={{ fontSize: '14px' }}
                                >
                                  star
                                </span>
                                <span
                                  className="text-[#0f42bc] text-sm font-normal"
                                  style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                                >
                                  {item.attr} · {item.timeQualifier}
                                </span>
                                <div className="absolute right-[10px] flex items-center gap-1.5 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-[#cce4ff] group-hover:to-[#cce4ff] pl-10 transition-colors">
                                  <button
                                    data-chip-menu-button
                                    onClick={() => {
                                      const menuKey = `${group.title}-excluded-${item.attr}`
                                      setChipMenuOpen(chipMenuOpen === menuKey ? null : menuKey)
                                    }}
                                    className="flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 ease-in-out cursor-pointer"
                                  >
                                    <span
                                      className="material-icons-round text-[#0f42bc]"
                                      style={{ fontSize: '16px' }}
                                    >
                                      more_vert
                                    </span>
                                  </button>
                                  <div className="w-px h-5 bg-[#0f42bc] opacity-0 group-hover:opacity-30 transition-opacity duration-200 ease-in-out"></div>
                                  <button
                                    onClick={() => handleRemoveAttributeV5(group.title, 'excluded', item.attr)}
                                    className="flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 ease-in-out cursor-pointer"
                                  >
                                    <span
                                      className="material-icons-round text-[#0f42bc]"
                                      style={{ fontSize: '16px' }}
                                    >
                                      close
                                    </span>
                                  </button>
                                </div>

                                {/* Dropdown Menu */}
                                {chipMenuOpen === `${group.title}-excluded-${item.attr}` && (
                                  <div data-chip-dropdown className="absolute top-full left-0 mt-1 bg-white border border-[#eaecf0] rounded-lg shadow-lg py-2 w-[200px] z-50">
                                    <div className="px-3 py-1">
                                      <p className="text-[#667085] text-xs font-medium" style={{ fontFamily: 'Roboto' }}>Priority</p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        handleAttributePriorityChangeV5(group.title, 'excluded', item.attr, item.timeQualifier, 'must-have')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Must Have</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAttributePriorityChangeV5(group.title, 'excluded', item.attr, item.timeQualifier, 'can-have')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Can Have</span>
                                    </button>
                                    <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors">
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Exclude</span>
                                      <span className="material-icons-round text-[#4599fa]" style={{ fontSize: '18px' }}>check</span>
                                    </button>

                                    <div className="h-px bg-[#eaecf0] my-2"></div>

                                    <div className="px-3 py-1">
                                      <p className="text-[#667085] text-xs font-medium" style={{ fontFamily: 'Roboto' }}>Preferences</p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        handleAttributeTimeChangeV5(group.title, 'excluded', item.attr, 'Current or Past')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Current or Past</span>
                                      {item.timeQualifier === 'Current or Past' && <span className="material-icons-round text-[#4599fa]" style={{ fontSize: '18px' }}>check</span>}
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAttributeTimeChangeV5(group.title, 'excluded', item.attr, 'Current')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Current</span>
                                      {item.timeQualifier === 'Current' && <span className="material-icons-round text-[#4599fa]" style={{ fontSize: '18px' }}>check</span>}
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAttributeTimeChangeV5(group.title, 'excluded', item.attr, 'Past')
                                        setChipMenuOpen(null)
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#f9fafb] transition-colors cursor-pointer"
                                    >
                                      <span className="text-[#101828] text-sm font-normal" style={{ fontFamily: 'Roboto' }}>Past</span>
                                      {item.timeQualifier === 'Past' && <span className="material-icons-round text-[#4599fa]" style={{ fontSize: '18px' }}>check</span>}
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add Button / Search Bar Container */}
                  <div className="relative w-full h-[38px]">
                    {/* Add Attribute Button - Always show below attributes */}
                    {selectedAttributesV5[group.title] && Object.keys(selectedAttributesV5[group.title]).length > 0 && searchBarOpen !== group.title && (
                      <button
                        onClick={() => setSearchBarOpen(group.title)}
                        className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer w-full px-1 py-1 rounded-md border-l-2 border-l-white hover:bg-[#f2f4f7] hover:border-l-[#f2f4f7]"
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
                    )}

                    {/* Add Attribute Button - Only show when no attributes */}
                    {(!selectedAttributesV5[group.title] || Object.keys(selectedAttributesV5[group.title]).length === 0) && searchBarOpen !== group.title && (
                      <button
                        onClick={() => setSearchBarOpen(group.title)}
                        className="flex items-center gap-0.5 text-[#667085] text-sm hover:text-[#465366] transition-colors cursor-pointer w-full px-1 py-1 rounded-md border-l-2 border-l-white hover:bg-[#f2f4f7] hover:border-l-[#f2f4f7]"
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
                    )}

                    {/* Version 5 Search Bar - Always below attributes */}
                    {searchBarOpen === group.title && (
                      <div className="absolute top-0 left-0 right-0 flex justify-center w-full z-10">
                        <AttributeSearchBar
                          category={group.title}
                          onClose={() => setSearchBarOpen(null)}
                          onSelect={(attribute) => handleSelectAttribute(group.title, attribute)}
                          qualifier={currentPriorityV5[group.title] || 'must-have'}
                          onQualifierChange={(newQualifier) => {
                            setCurrentPriorityV5(prev => ({
                              ...prev,
                              [group.title]: newQualifier
                            }))
                          }}
                          timeQualifier={currentTimeQualifier[group.title] || 'Current'}
                          onTimeQualifierChange={(newTimeQualifier) => {
                            setCurrentTimeQualifier(prev => ({
                              ...prev,
                              [group.title]: newTimeQualifier
                            }))
                          }}
                          useMustHaveQualifier={true}
                          showBoolean={shouldShowBoolean(group.title)}
                        />
                      </div>
                    )}
                  </div>
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
            version={version}
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

      {/* Boolean Skills Modal */}
      {booleanModalOpen && booleanModalCategory && (
        <BooleanSkillsModal
          category={booleanModalCategory}
          qualifier={currentQualifier[booleanModalCategory] || 'Current'}
          onClose={() => {
            setBooleanModalOpen(false)
            setBooleanModalCategory(null)
          }}
          onApply={handleBooleanSkillsApply}
        />
      )}
    </div>
  )
}

export default MatchCriteriaPanel
