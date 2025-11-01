import Header from '../components/Header'
import SecondHeader from '../components/SecondHeader'
import MatchCriteriaPanel from '../components/MatchCriteriaPanel'
import HorizontalTabs from '../components/HorizontalTabs'
import CandidateList from '../components/CandidateList'

function Search() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <SecondHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Match Criteria Panel */}
        <MatchCriteriaPanel />

        {/* Right Column - Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <HorizontalTabs />
          <CandidateList />
        </div>
      </div>
    </div>
  )
}

export default Search
