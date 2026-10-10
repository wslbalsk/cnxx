import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Sessão encerrada com sucesso.',
  });

  response.cookies.set('mu_session_user', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}
