import type { OpportunityType } from '@/constants/opportunity-types'

// Illustrative rows for the Discover card. They show the kind of listing the
// agent finds; they are not real listings.
export const DISCOVER_SAMPLES: Array<{
  title: string
  type: OpportunityType
  detail: string
  due: string
}> = [
  {
    title: 'Merit scholarship for engineering students',
    type: 'scholarships',
    detail: '₹50,000 a year',
    due: '12 days left',
  },
  {
    title: 'Summer research internship',
    type: 'internships',
    detail: 'Stipend ₹15,000 a month',
    due: '3 weeks left',
  },
  {
    title: 'Inter-college AI hackathon',
    type: 'hackathons',
    detail: 'Teams of 2 to 4',
    due: '5 days left',
  },
  {
    title: 'State scheme for first-generation learners',
    type: 'govt schemes',
    detail: 'Full fee waiver',
    due: '1 month left',
  },
]
