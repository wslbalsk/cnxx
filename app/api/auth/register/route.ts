import { NextRequest, NextResponse } from 'next/server';
import { MuDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, email, repeatPassword } = body;

    if (!username || !password || !email) {
      return NextResponse.json(
        { success: false, message: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    const cleanUser = String(username).trim().toLowerCase();

    // Mu Online login rules: 4 to 10 alphanumeric characters
    if (cleanUser.length < 4 || cleanUser.length > 10) {
      return NextResponse.json(
        { success: false, message: 'O login deve ter entre 4 e 10 caracteres.' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9]+$/.test(cleanUser)) {
      return NextResponse.json(
        { success: false, message: 'O login só pode conter letras e números (sem espaços ou símbolos).' },
        { status: 400 }
      );
    }

    if (password.length < 4 || password.length > 12) {
      return NextResponse.json(
        { success: false, message: 'A senha deve ter entre 4 e 12 caracteres.' },
        { status: 400 }
      );
    }

    if (repeatPassword && password !== repeatPassword) {
      return NextResponse.json(
        { success: false, message: 'As senhas digitadas não coincidem.' },
        { status: 400 }
      );
    }

    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { success: false, message: 'Informe um endereço de e-mail válido.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await MuDatabase.findAccount(cleanUser);
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Este login já está cadastrado no servidor. Escolha outro.' },
        { status: 409 }
      );
    }

    // Insert account
    await MuDatabase.createAccount(cleanUser, password, email);

    const [characters, shopPoints] = await Promise.all([
      MuDatabase.getUserCharacters(cleanUser),
      MuDatabase.getShopPoints(cleanUser),
    ]);

    const response = NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso! Bem-vindo ao continente de Mu Online.',
      user: {
        username: cleanUser,
        email: email,
        shopPoints,
        characters,
      },
    });

    response.cookies.set('mu_session_user', cleanUser, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
