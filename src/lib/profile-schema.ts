import { z } from 'zod';

export const years = ['1st', '2nd', '3rd', '4th', 'PG'] as const;
export const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'] as const;
export const incomeRanges = ['Below ₹1 lakh', '₹1–2.5 lakh', '₹2.5–5 lakh', '₹5–8 lakh', 'Above ₹8 lakh'] as const;
export const interests = ['scholarships', 'internships', 'hackathons', 'govt schemes'] as const;
const shortText = z.string().trim().min(1, 'Please fill in this field.').max(100);
export const academicSchema = z.object({ name: shortText, college: shortText.max(200), branch: shortText, year: z.enum(years), state: shortText });
export const backgroundSchema = z.object({ category: z.enum(categories), family_income_range: z.enum(incomeRanges), cgpa: z.number().min(0).max(10) });
export const preferencesSchema = z.object({ interests: z.array(z.enum(interests)).min(1, 'Choose at least one interest.').max(4), skills: z.array(shortText.max(50)).max(30) });
export const profileSchema = academicSchema.merge(backgroundSchema).merge(preferencesSchema);
export type ProfileInput = z.infer<typeof profileSchema>;
export function profileDestination(profile: { completed_at: string | null } | null) {
  return profile?.completed_at ? '/dashboard' as const : '/onboarding' as const;
}
export const credentialSchema = z.object({ email: z.string().trim().email('Enter a valid email address.').max(255), password: z.string().min(8, 'Use at least 8 characters.').max(128) });