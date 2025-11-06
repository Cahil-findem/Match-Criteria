import CandidateListHeader from './CandidateListHeader'
import CandidateRow from './CandidateRow'

const candidates = [
  {
    name: 'Sarah Chen',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=68&h=68&fit=crop',
    currentTitle: 'Staff Software Engineer',
    currentCompany: 'Meta',
    location: 'Seattle, WA',
    yearsExperience: 12,
    experience: [
      {
        title: 'Staff Software Engineer',
        company: 'Meta',
        period: 'Mar 2020 - Present',
        logo: 'https://www.google.com/s2/favicons?domain=meta.com&sz=128'
      },
      {
        title: 'Senior Software Engineer',
        company: 'Amazon',
        period: 'Jan 2017 - Mar 2020',
        logo: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128'
      },
      {
        title: 'Software Engineer',
        company: 'Microsoft',
        period: 'Jun 2014 - Dec 2016',
        logo: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128'
      },
      {
        title: 'Junior Software Engineer',
        company: 'Salesforce',
        period: 'Aug 2012 - May 2014',
        logo: 'https://www.google.com/s2/favicons?domain=salesforce.com&sz=128'
      }
    ],
    education: {
      degree: 'MS, Computer Science',
      school: 'Stanford',
      period: 'Sep 2010 - Jun 2012'
    }
  },
  {
    name: 'Marcus Johnson',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=68&h=68&fit=crop',
    currentTitle: 'Lead Engineer',
    currentCompany: 'Stripe',
    location: 'Austin, TX',
    yearsExperience: 8,
    experience: [
      {
        title: 'Lead Engineer',
        company: 'Stripe',
        period: 'Feb 2022 - Present',
        logo: 'https://www.google.com/s2/favicons?domain=stripe.com&sz=128'
      },
      {
        title: 'Senior Engineer',
        company: 'Shopify',
        period: 'May 2019 - Jan 2022',
        logo: 'https://www.google.com/s2/favicons?domain=shopify.com&sz=128'
      },
      {
        title: 'Software Engineer',
        company: 'Square',
        period: 'Jul 2017 - Apr 2019',
        logo: 'https://www.google.com/s2/favicons?domain=squareup.com&sz=128'
      },
      {
        title: 'Associate Engineer',
        company: 'PayPal',
        period: 'Jun 2016 - Jun 2017',
        logo: 'https://www.google.com/s2/favicons?domain=paypal.com&sz=128'
      }
    ],
    education: {
      degree: 'BS, Software Engineering',
      school: 'MIT',
      period: 'Sep 2012 - May 2016'
    }
  },
  {
    name: 'Priya Patel',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=68&h=68&fit=crop',
    currentTitle: 'Principal Engineer',
    currentCompany: 'Netflix',
    location: 'Los Gatos, CA',
    yearsExperience: 15,
    experience: [
      {
        title: 'Principal Engineer',
        company: 'Netflix',
        period: 'Jan 2019 - Present',
        logo: 'https://www.google.com/s2/favicons?domain=netflix.com&sz=128'
      },
      {
        title: 'Senior Staff Engineer',
        company: 'Uber',
        period: 'Mar 2016 - Dec 2018',
        logo: 'https://www.google.com/s2/favicons?domain=uber.com&sz=128'
      },
      {
        title: 'Senior Engineer',
        company: 'Airbnb',
        period: 'Aug 2013 - Feb 2016',
        logo: 'https://www.google.com/s2/favicons?domain=airbnb.com&sz=128'
      },
      {
        title: 'Software Engineer',
        company: 'LinkedIn',
        period: 'Jun 2011 - Jul 2013',
        logo: 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=128'
      },
      {
        title: 'Junior Engineer',
        company: 'Twitter',
        period: 'Jul 2009 - May 2011',
        logo: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=128'
      }
    ],
    education: {
      degree: 'PhD, Distributed Systems',
      school: 'Berkeley',
      period: 'Sep 2005 - May 2009'
    }
  }
]

function CandidateList() {
  return (
    <div className="flex flex-col h-full pl-6 pr-8">
      <CandidateListHeader />
      <div className="flex-1 overflow-y-auto bg-white border-l border-r border-[#eaecf0]">
        {candidates.map((candidate, index) => (
          <CandidateRow key={index} candidate={candidate} />
        ))}
      </div>
    </div>
  )
}

export default CandidateList
