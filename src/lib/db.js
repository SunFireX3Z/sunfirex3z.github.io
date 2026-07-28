import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
    console.warn("Supabase environment variables (PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY) are not set. Database features will be disabled.");
}

// Membuat satu instance Supabase client dan mengekspornya.
// Astro akan menyimpan cache modul ini, sehingga Anda mendapatkan perilaku seperti singleton.
export const supabase = createClient(supabaseUrl, supabasePublishableKey);