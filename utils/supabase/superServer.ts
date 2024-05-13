import 'server-only'
import { createClient } from "@supabase/supabase-js";

export function createSupaServerClient(){
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!,{
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        }
    })
}