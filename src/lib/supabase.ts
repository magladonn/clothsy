import { createClient } from '@supabase/supabase-js'

// Your Project URL
const supabaseUrl = 'https://fdgvhmgxyxdnxwhvmrhk.supabase.co'

// Your API Key (The one you just sent)
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZ3ZobWd4eXhkbnh3aHZtcmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNzI2NTgsImV4cCI6MjA4NTY0ODY1OH0.GrIfcNcJFUfGHUCzqEHa0EXCzVJWm0_kXKnrBtMADmo'

export const supabase = createClient(supabaseUrl, supabaseKey)
