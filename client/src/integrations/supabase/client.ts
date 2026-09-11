import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL: string =
  import.meta.env.VITE_SUPABASE_URL || 'https://tbonnyvcqyjsfehyridi.supabase.co';
const SUPABASE_PUBLISHABLE_KEY: string =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Ve5Nd4dX_t9OFuhr_DFBkQ_cPh1JkoC';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});