export const PROFILE_QUERY_KEY = {
  profile: 'student-profile',
} as const

// The choices below must match the check constraints on `public.profiles`
// (supabase/migrations).

export const YEARS = ['1st', '2nd', '3rd', '4th', 'PG'] as const

export const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'] as const

export const INCOME_RANGES = [
  'Below ₹1 lakh',
  '₹1–2.5 lakh',
  '₹2.5–5 lakh',
  '₹5–8 lakh',
  'Above ₹8 lakh',
] as const

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const

export const MAX_SKILLS = 30
export const MAX_SKILL_LENGTH = 50

export const YEAR_LABELS: Record<(typeof YEARS)[number], string> = {
  '1st': '1st year',
  '2nd': '2nd year',
  '3rd': '3rd year',
  '4th': '4th year',
  PG: 'Postgraduate',
}
