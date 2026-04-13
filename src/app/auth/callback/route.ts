import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Auth callback failed:', error);
      return NextResponse.redirect(new URL('/auth/login?error=callback_failed', request.url));
    }
  }

  return NextResponse.redirect(new URL('/chat', request.url));
}
