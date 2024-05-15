import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const supabase = createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    // Check if the type is 'invite'
    if (type === 'invite' && data?.user && !error) {
      // Confirm the invite in supabase
      const { error } = await supabase.auth.admin.updateUserById(
        data.user.id,
        { email_confirm: true }
      )
    }

    // check if the type is 'email' which means the user is confirming their signup email
    if (type === 'email' && data?.user && !error) {
      // Redirect the user to the organization creation page
      redirectTo.pathname = '/org/create'
      // Add a query parameter to indicate the email is confirmed
      redirectTo.searchParams.set('email_confirmed', 'true')
    }
    
    // Check if the type is 'email_change'
    if (type === 'email_change' && data?.user && !error && (data.user as any).msg) {
      if ((data.user as any).msg === 'Confirmation link accepted. Please proceed to confirm link sent to the other email') {
        // Redirect the user to account page
        redirectTo.pathname = '/account'
        // Add a query parameter to indicate the new email is not confirmed yet
        redirectTo.searchParams.set('new_email_not_confirmed', 'true')
      }
    }

    if (!error) {
      redirectTo.searchParams.delete('next')
      //console.log('Redirecting to:', redirectTo.toString())
      return NextResponse.redirect(redirectTo)
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/error'
  return NextResponse.redirect(redirectTo)
}