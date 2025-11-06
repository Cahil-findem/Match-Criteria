import { useState } from 'react'

function BooleanSkillsDisplay({ booleanData, onUpdate, onRemove, qualifier }) {
  const [isMustHave, setIsMustHave] = useState(true)

  // booleanData structure: { orGroups: [[skill1, skill2], [skill3, skill4]] }
  // orGroups is an array of arrays, where each inner array represents skills connected by OR
  // and the outer array represents groups connected by AND

  const handleToggle = () => {
    setIsMustHave(!isMustHave)
  }

  const handleRemoveSkill = (groupIndex, skillIndex) => {
    const newOrGroups = booleanData.orGroups.map((group, gIdx) => {
      if (gIdx === groupIndex) {
        return group.filter((_, sIdx) => sIdx !== skillIndex)
      }
      return group
    }).filter(group => group.length > 0)

    if (newOrGroups.length === 0) {
      onRemove()
    } else {
      onUpdate({ orGroups: newOrGroups })
    }
  }

  if (!booleanData || !booleanData.orGroups || booleanData.orGroups.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-1 w-full px-1 pt-1 pb-1.5">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between pb-1">
        <p
          className="text-[#667085] text-sm font-normal"
          style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
        >
          {isMustHave ? 'Must-Have (Boolean Active)' : 'Nice-to-Have'}
        </p>
        <button
          onClick={handleToggle}
          className="relative w-6 h-[13px] rounded-full transition-colors cursor-pointer"
          style={{ background: isMustHave ? '#4599FA' : '#969DAD' }}
        >
          <div
            className="absolute top-[2px] w-[9px] h-[9px] bg-white rounded-full transition-transform"
            style={{
              transform: isMustHave ? 'translateX(13px)' : 'translateX(2px)'
            }}
          />
        </button>
      </div>

      {/* Boolean Groups */}
      <div className="flex flex-col gap-1.5 pb-2">
        {booleanData.orGroups.map((orGroup, groupIndex) => (
          <div key={groupIndex} className="flex flex-col gap-1.5">
            {/* OR Group Box */}
            <div
              className="self-stretch p-2 rounded-xl flex-col justify-start items-start gap-2 flex"
              style={{ outline: '1px #EAECF0 solid', outlineOffset: '-1px' }}
            >
              <div className="self-stretch justify-start items-center gap-1 inline-flex flex-wrap">
                {orGroup.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex items-center gap-1">
                    {skillIndex > 0 && (
                      <span
                        className="text-[#969dad] text-[13px] font-normal"
                        style={{ fontFamily: 'Roboto', lineHeight: '18px' }}
                      >
                        or
                      </span>
                    )}
                    <div className="px-[10px] py-1 bg-[#e1efff] rounded-2xl flex items-center gap-1">
                      <span
                        className="text-[#0f42bc] text-sm font-normal"
                        style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                      >
                        {skill}
                      </span>
                      <button
                        onClick={() => handleRemoveSkill(groupIndex, skillIndex)}
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
                  </div>
                ))}
              </div>
            </div>

            {/* AND connector between groups */}
            {groupIndex < booleanData.orGroups.length - 1 && (
              <div className="px-1.5 py-1 bg-[#f3f5f8] rounded flex-col justify-start items-start gap-2.5 inline-flex self-start">
                <div
                  className="text-[#101828] text-xs font-normal"
                  style={{ fontFamily: 'Roboto' }}
                >
                  and must also be
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BooleanSkillsDisplay
