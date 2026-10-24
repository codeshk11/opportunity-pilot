import { createServerFn } from '@tanstack/react-start';
import { queryOptions } from '@tanstack/react-query';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { profileSchema } from './profile-schema';

export const getProfile = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from('profiles').select('*').eq('user_id', context.userId).maybeSingle();
  if (error) throw new Error('Your profile could not be loaded. Please try again.');
  return data;
});
export const saveProfile = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input: unknown) => profileSchema.parse(input)).handler(async ({ context, data }) => {
  const { error } = await context.supabase.from('profiles').upsert({ ...data, user_id: context.userId, completed_at: new Date().toISOString() });
  if (error) throw new Error('Your profile could not be saved. Please try again.');
  return { saved: true };
});
export const profileQueryOptions = queryOptions({ queryKey: ['student-profile'], queryFn: () => getProfile() });