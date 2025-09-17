
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';

const SUPABASE_URL = 'https://ibghirceyvucjckvnkxj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZ2hpcmNleXZ1Y2pja3Zua3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNzQ4OTcsImV4cCI6MjA3MzY1MDg5N30.qerUO8geWQGiWL5ttYZXlu4-MkXWV54qNnVZRQZc_xA';

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
