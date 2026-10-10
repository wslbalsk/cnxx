import { NextRequest, NextResponse } from 'next/server';
import { MuDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Usuário e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const cleanUser = String(username).trim().toLowerCase();
    const account = await MuDatabase.findAccount(cleanUser);

    if (!account) {
      return NextResponse.json(
        { success: false, message: 'Conta não encontrada no servidor.' },
        { status: 401 }
      );
    }

    if (account.bloc_code === '1') {
      return NextResponse.json(
        { success: false, message: 'Esta conta está bloqueada pela administração.' },
        { status: 403 }
      );
    }

    // Season 6 accounts usually have plain-text or MD5 passwords depending on server config
    const pwdMatch =
      account.memb__passwd === password ||
      (account.memb__passwd && account.memb__passwd.toLowerCase() === password.toLowerCase());

    if (!pwdMatch) {
      return NextResponse.json(
        { success: false, message: 'Senha incorreta. Verifique suas credenciais.' },
        { status: 401 }
      );
    }

    const [characters, shopPoints] = await Promise.all([
      MuDatabase.getUserCharacters(cleanUser),
      MuDatabase.getShopPoints(cleanUser),
    ]);

    const response = NextResponse.json({
      success: true,
      message: 'Login efetuado com sucesso!',
      user: {
        username: account.memb___id,
        email: account.mail_addr,
        shopPoints,
        characters,
      },
    });

    // Set lightweight session cookie for state persistence
    response.cookies.set('mu_session_user', account.memb___id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
