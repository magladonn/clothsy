import { createClient } from '@supabase/supabase-js'

// Your Project URL
const supabaseUrl = 'https://fdgvhmgxyxdnxwhvmrhk.supabase.co'

// Your API Key
// NOTE: Ideally this should be the long "anon public" key starting with "ey..."
// If the key below doesn't work, go to Supabase > Settings > API and copy the "anon" key.
const supabaseKey = 'sb_publishable_StTNEygqktlS_s0p26-3yA_ioUXh10q'

export const supabase = createClient(supabaseUrl, supabaseKey)
