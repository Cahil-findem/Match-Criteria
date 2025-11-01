function CandidateRow({ candidate }) {
  return (
    <div className="bg-white border-b border-[#eaecf0] flex flex-col gap-2.5 p-6">
      <div className="flex gap-2 items-start w-full">
        {/* Main Content Wrapper */}
        <div className="flex flex-wrap gap-5 flex-1 min-w-0">
          {/* Left Column - Name and Experience */}
          <div className="flex gap-5 w-[483px]">
            {/* Profile Picture */}
            <div className="overflow-hidden rounded-full shrink-0 size-[68px]">
              <img
                src={candidate.photo}
                alt={candidate.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Column */}
            <div className="flex flex-col gap-3 w-[440px]">
              {/* Basic Info */}
              <div className="flex flex-col gap-px">
                {/* Name */}
                <div className="flex gap-1.5 items-center">
                  <p
                    className="text-[#101828] text-lg font-medium"
                    style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                  >
                    {candidate.name}
                  </p>
                </div>

                {/* Current Job */}
                <div className="flex gap-1.5 items-center">
                  <p
                    className="text-sm"
                    style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                  >
                    <span className="text-[#465366]">{candidate.currentTitle} </span>
                    <span className="text-[#969dad]">at </span>
                    <span className="text-[#465366]">{candidate.currentCompany}</span>
                  </p>
                </div>

                {/* Location */}
                <div className="flex gap-1.5 items-center">
                  <p
                    className="text-[#667085] text-sm"
                    style={{ fontFamily: 'Roboto', lineHeight: '20px' }}
                  >
                    {candidate.location}
                  </p>
                </div>
              </div>

              {/* Experience Section */}
              <div className="flex flex-col gap-2 w-full">
                <p
                  className="text-[#101828] text-[13px] font-medium"
                  style={{ fontFamily: 'Roboto', lineHeight: '22px' }}
                >
                  {candidate.yearsExperience} Years Overall Experience
                </p>

                {/* Experience Rows */}
                <div className="flex flex-col gap-0.5 w-[380px]">
                  <div className="flex flex-col gap-1">
                    {candidate.experience.map((job, index) => (
                      <div key={index} className="flex gap-2 h-6 items-center w-full">
                        <div className="bg-white rounded-[4px] shrink-0 size-6 overflow-hidden flex items-center justify-center">
                          <img
                            src={job.logo}
                            alt={job.company}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 items-center flex-1 min-w-0">
                          <p
                            className="text-[13px]"
                            style={{ fontFamily: 'Roboto', lineHeight: '18px' }}
                          >
                            <span className="text-[#313131]">{job.title}</span>{' '}
                            <span className="text-[#969dad]">at</span>{' '}
                            <span className="text-[#313131] underline">{job.company}</span>
                          </p>
                          <p
                            className="text-[#667085] text-[13px]"
                            style={{ fontFamily: 'Roboto', lineHeight: '18px' }}
                          >
                            {job.period}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Education Section */}
              {candidate.education && (
                <div className="flex flex-col gap-2 w-full">
                  <p
                    className="text-[#101828] text-[13px] font-medium"
                    style={{ fontFamily: 'Roboto', lineHeight: '22px' }}
                  >
                    Education
                  </p>

                  <div className="flex flex-col gap-1 w-[336px]">
                    <div className="flex gap-2 items-center w-full">
                      <div className="bg-[#f2f4f7] overflow-hidden rounded-[4px] shrink-0 size-6 flex items-center justify-center">
                        <span className="material-icons-round text-[#667085] text-base">
                          school
                        </span>
                      </div>
                      <p
                        className="text-[13px]"
                        style={{ fontFamily: 'Roboto', lineHeight: '18px' }}
                      >
                        <span className="text-[#101828]">{candidate.education.degree} </span>
                        <span className="text-[#969dad]">at</span>{' '}
                        <span className="text-[#101828]">{candidate.education.school}</span>
                      </p>
                      <p
                        className="text-[#667085] text-[13px]"
                        style={{ fontFamily: 'Roboto', lineHeight: '18px' }}
                      >
                        {candidate.education.period}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Highlights */}
          <div className="flex flex-col gap-8 pt-20 w-[221px]">
            {/* Match Score Section */}
            <div className="flex flex-col gap-1.5 w-full">
              <p
                className="text-[#101828] text-[13px] font-medium"
                style={{ fontFamily: 'Roboto', lineHeight: '22px' }}
              >
                Match Score
              </p>

              {/* High Priority Candidate */}
              <div className="flex gap-2 h-[26px] items-center rounded-[4px] w-[300px]">
                <div className="flex gap-0.5 h-3 items-center justify-center w-[59px]">
                  <div className="flex gap-0.5 items-center flex-1">
                    <div
                      className="flex-1 h-2 rounded-[4px]"
                      style={{
                        background: 'linear-gradient(90deg, rgba(146, 216, 165, 0.7) 0%, rgba(146, 216, 165, 0.7) 100%)',
                      }}
                    />
                    <div className="flex-1 bg-[#92d8a5] h-2 rounded-[4px]" />
                    <div className="flex-1 bg-[#6bca85] h-2 rounded-[4px]" />
                    <div className="w-[13.25px] bg-[#207c39] h-2 rounded-[4px]" />
                  </div>
                </div>
                <div className="flex gap-1 items-center flex-1">
                  <p
                    className="text-[#207c39] text-[13px] underline"
                    style={{ fontFamily: 'Roboto', lineHeight: '22px' }}
                  >
                    High priority candidate
                  </p>
                </div>
              </div>

              {/* Early Stage Startup */}
              <div className="flex gap-2 h-[26px] items-center rounded-[4px] w-full">
                <div className="bg-[#f6f4ff] flex items-center justify-center overflow-hidden px-2.5 py-2 rounded-[4px] shrink-0 size-6">
                  <span
                    className="material-icons-round text-[#4a2edf] text-base"
                    style={{ fontSize: '16px', lineHeight: '19.6px' }}
                  >
                    work
                  </span>
                </div>
                <p
                  className="text-[#101828] text-[13px]"
                  style={{ fontFamily: 'Roboto', lineHeight: '18px' }}
                >
                  Early stage startup experience
                </p>
              </div>
            </div>

            {/* Warmth Score Section */}
            <div className="flex flex-col gap-1.5 w-full">
              <p
                className="text-[#101828] text-[13px] font-medium"
                style={{ fontFamily: 'Roboto', lineHeight: '22px' }}
              >
                Warmth Score
              </p>

              {/* 7x More Likely */}
              <div className="flex gap-2 h-[26px] items-center rounded-[4px] w-[300px]">
                <div className="flex gap-1.5 items-center">
                  <div className="flex gap-0.5 h-3 items-center justify-center w-[59px]">
                    <div className="flex gap-0.5 items-center flex-1">
                      <div className="flex-1 bg-[#fde895] h-2 rounded-[4px]" />
                      <div className="flex-1 bg-[#fec84b] h-2 rounded-[4px]" />
                      <div className="flex-1 bg-[#f79009] h-2 rounded-[4px]" />
                      <div className="flex-1 bg-[#b54708] h-2 rounded-[4px]" />
                    </div>
                  </div>
                  <p
                    className="text-[#b54708] text-[13px]"
                    style={{ fontFamily: 'Roboto', lineHeight: '18px' }}
                  >
                    7x more likely to engage
                  </p>
                </div>
              </div>

              {/* Additional Warmth Info */}
              <div className="flex flex-col gap-1.5 w-full">
                {/* 2 Applications */}
                <div className="flex gap-2 h-[26px] items-center rounded-[4px] w-full">
                  <div className="bg-[#e1efff] flex items-center justify-center overflow-hidden px-2.5 py-2 rounded-[4px] shrink-0 size-6">
                    <span
                      className="material-icons-round text-[#0f42bc] text-base"
                      style={{ fontSize: '16px' }}
                    >
                      east
                    </span>
                  </div>
                  <p
                    className="text-[#101828] text-[13px] underline"
                    style={{ fontFamily: 'Roboto', lineHeight: '22px' }}
                  >
                    2 applications in our ATS
                  </p>
                </div>

                {/* ATS Link */}
                <div className="flex gap-2 h-[26px] items-center rounded-[4px] w-full">
                  <div className="bg-[#24a47f] overflow-hidden rounded-[4px] shrink-0 size-[26px] flex items-center justify-center">
                    <span className="material-icons-round text-white text-base">
                      link
                    </span>
                  </div>
                  <div className="flex gap-1 items-center flex-1">
                    <p
                      className="text-[#101828] text-[13px]"
                      style={{ fontFamily: 'Roboto', lineHeight: '18px' }}
                    >
                      View profile in your
                    </p>
                    <p
                      className="text-[#101828] text-[13px] underline"
                      style={{ fontFamily: 'Roboto', lineHeight: '22px' }}
                    >
                      ATS,
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 items-center shrink-0">
          <div className="flex flex-col gap-2 w-[288px]">
            <div className="flex gap-1 items-center justify-end w-full">
              <button className="bg-[#4599fa] flex gap-1.5 items-center justify-center overflow-hidden px-3.5 py-2 rounded-[6px] shrink-0 hover:bg-[#3a86e0] transition-colors">
                <span
                  className="text-white text-sm"
                  style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                >
                  Add to Shortlist
                </span>
              </button>
              <button className="bg-[#f2f4f7] flex gap-1.5 items-center justify-center overflow-hidden px-3.5 py-2 rounded-[6px] shrink-0 hover:bg-[#e5e7eb] transition-colors">
                <span
                  className="text-[#101828] text-sm"
                  style={{ fontFamily: 'Roboto', lineHeight: '19.6px' }}
                >
                  Remove
                </span>
              </button>
              <button className="bg-[#f2f4f7] flex items-center justify-center overflow-hidden px-3 py-2 rounded-[6px] shrink-0 size-9 hover:bg-[#e5e7eb] transition-colors">
                <span className="material-icons-round text-[#465366]" style={{ fontSize: '18px' }}>
                  mail
                </span>
              </button>
            </div>
          </div>
          <button className="bg-[#f2f4f7] flex items-center justify-center overflow-hidden px-3 py-2 rounded-[6px] shrink-0 size-9 hover:bg-[#e5e7eb] transition-colors">
            <span className="material-icons-round text-[#465366]" style={{ fontSize: '18px' }}>
              more_vert
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CandidateRow
