import { useState } from 'react'

function BooleanSkillsModal({ category, onClose, onApply, qualifier }) {
  const [orGroups, setOrGroups] = useState([['']])
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)

  const handleSkillChange = (groupIndex, skillIndex, value) => {
    const newOrGroups = orGroups.map((group, gIdx) => {
      if (gIdx === groupIndex) {
        return group.map((skill, sIdx) => sIdx === skillIndex ? value : skill)
      }
      return group
    })
    setOrGroups(newOrGroups)
  }

  const handleAddOrSkill = (groupIndex) => {
    const newOrGroups = orGroups.map((group, gIdx) => {
      if (gIdx === groupIndex) {
        return [...group, '']
      }
      return group
    })
    setOrGroups(newOrGroups)
  }

  const handleAddAndGroup = () => {
    setOrGroups([...orGroups, ['']])
  }

  const handleRemoveSkill = (groupIndex, skillIndex) => {
    const newOrGroups = orGroups.map((group, gIdx) => {
      if (gIdx === groupIndex) {
        return group.filter((_, sIdx) => sIdx !== skillIndex)
      }
      return group
    }).filter(group => group.length > 0)

    if (newOrGroups.length === 0) {
      setOrGroups([['']])
    } else {
      setOrGroups(newOrGroups)
    }
  }

  const handleApply = () => {
    // Filter out empty skills and empty groups
    const filteredGroups = orGroups
      .map(group => group.filter(skill => skill.trim() !== ''))
      .filter(group => group.length > 0)

    if (filteredGroups.length > 0) {
      onApply({ orGroups: filteredGroups })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-[500px] max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eaecf0]">
          <div className="flex items-center justify-between">
            <h3
              className="text-[#101828] text-lg font-medium"
              style={{ fontFamily: 'Roboto', lineHeight: '28px' }}
            >
              Boolean {category} - {qualifier}
            </h3>
            <button
              onClick={onClose}
              className="text-[#667085] hover:text-[#101828] transition-colors"
            >
              <span className="material-icons-round" style={{ fontSize: '24px' }}>close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex flex-col gap-4">
            {orGroups.map((orGroup, groupIndex) => (
              <div key={groupIndex} className="flex flex-col gap-3">
                {/* OR Group */}
                <div className="p-4 border border-[#eaecf0] rounded-lg flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[#667085] text-sm font-medium" style={{ fontFamily: 'Roboto' }}>
                      OR Group {groupIndex + 1}
                    </p>
                  </div>

                  {orGroup.map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange(groupIndex, skillIndex, e.target.value)}
                        placeholder={
                          category === 'Job Title' ? 'Enter job title...' :
                          category === 'Companies' ? 'Enter company...' :
                          'Enter skill...'
                        }
                        className="flex-1 px-3 py-2 border border-[#d0d5dd] rounded-lg text-[#101828] text-sm outline-none focus:border-[#4599fa]"
                        style={{ fontFamily: 'Roboto' }}
                      />
                      {orGroup.length > 1 && (
                        <button
                          onClick={() => handleRemoveSkill(groupIndex, skillIndex)}
                          className="text-[#667085] hover:text-[#101828] transition-colors"
                        >
                          <span className="material-icons-round" style={{ fontSize: '20px' }}>close</span>
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddOrSkill(groupIndex)}
                    className="flex items-center gap-1 text-[#4599fa] text-sm font-medium hover:text-[#3582db] transition-colors"
                    style={{ fontFamily: 'Roboto' }}
                  >
                    <span className="material-icons-round" style={{ fontSize: '18px' }}>add</span>
                    Add OR {category === 'Job Title' ? 'job title' : category === 'Companies' ? 'company' : 'skill'}
                  </button>
                </div>

                {/* AND connector */}
                {groupIndex < orGroups.length - 1 && (
                  <div className="px-3 py-2 bg-[#f3f5f8] rounded self-start">
                    <span className="text-[#101828] text-xs font-normal" style={{ fontFamily: 'Roboto' }}>
                      and must also be
                    </span>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleAddAndGroup}
              className="flex items-center gap-1 text-[#4599fa] text-sm font-medium hover:text-[#3582db] transition-colors"
              style={{ fontFamily: 'Roboto' }}
            >
              <span className="material-icons-round" style={{ fontSize: '18px' }}>add</span>
              Add AND group
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#eaecf0] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#d0d5dd] rounded-lg text-[#344054] text-sm font-medium hover:bg-[#f9fafb] transition-colors"
            style={{ fontFamily: 'Roboto' }}
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-[#4599fa] rounded-lg text-white text-sm font-medium hover:bg-[#3582db] transition-colors"
            style={{ fontFamily: 'Roboto' }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default BooleanSkillsModal
