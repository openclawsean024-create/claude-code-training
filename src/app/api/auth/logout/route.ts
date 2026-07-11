// Claude Code Training — POST /api/auth/logout
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('cct_session')
  return NextResponse.json({ code: 'LOGOUT_SUCCESS' })
}