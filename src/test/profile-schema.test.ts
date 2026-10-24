import { describe, expect, it } from 'vitest';
import { academicSchema, backgroundSchema, preferencesSchema, profileDestination } from '@/lib/profile-schema';

describe('Student account rules', () => {
  it('sends users with no profile to onboarding', () => { expect(profileDestination(null)).toBe('/onboarding'); });
  it('sends incomplete signup profiles to onboarding', () => { expect(profileDestination({ completed_at: null })).toBe('/onboarding'); });
  it('sends completed profiles to dashboard', () => { expect(profileDestination({ completed_at: '2026-10-24T08:00:00Z' })).toBe('/dashboard'); });
  it('accepts only 1st through 4th and PG years', () => {
    const student = { name: 'Esha', college: 'College', branch: 'CS', state: 'Delhi' };
    for (const year of ['1st','2nd','3rd','4th','PG']) expect(academicSchema.safeParse({ ...student, year }).success).toBe(true);
    expect(academicSchema.safeParse({ ...student, year: '5th' }).success).toBe(false);
  });
  it('accepts only General, OBC, SC, ST and EWS categories', () => {
    for (const category of ['General','OBC','SC','ST','EWS']) expect(backgroundSchema.safeParse({ category, family_income_range: 'Below ₹1 lakh', cgpa: 8 }).success).toBe(true);
    expect(backgroundSchema.safeParse({ category: 'Other', family_income_range: 'Below ₹1 lakh', cgpa: 8 }).success).toBe(false);
  });
  it('accepts only the four opportunity interests', () => {
    expect(preferencesSchema.safeParse({ interests: ['scholarships','internships','hackathons','govt schemes'], skills: ['Python'] }).success).toBe(true);
    expect(preferencesSchema.safeParse({ interests: ['jobs'], skills: [] }).success).toBe(false);
  });
});