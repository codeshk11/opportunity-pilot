import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';
export const AccountContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });
export const useAccount = () => useContext(AccountContext);