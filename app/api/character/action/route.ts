import { NextRequest, NextResponse } from 'next/server';
import { MuDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('mu_session_user')?.value;
    const body = await req.json();
    const { action, characterName, username, newPassword } = body;

    const targetUser = sessionCookie || username;

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: 'Usuário não autenticado.' },
        { status: 401 }
      );
    }

    if (action === 'change_password') {
      if (!newPassword || newPassword.length < 4) {
        return NextResponse.json(
          { success: false, message: 'A nova senha deve ter no mínimo 4 caracteres.' },
          { status: 400 }
        );
      }
      const updated = await MuDatabase.updatePassword(targetUser, newPassword);
      return NextResponse.json({
        success: updated,
        message: updated ? 'Senha alterada com sucesso!' : 'Falha ao alterar senha.',
      });
    }

    if (!characterName) {
      return NextResponse.json(
        { success: false, message: 'Nome do personagem não informado.' },
        { status: 400 }
      );
    }

    if (!['clear_pk', 'reset_stats', 'unstuck'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Ação inválida.' },
        { status: 400 }
      );
    }

    const result = await MuDatabase.performCharacterAction(targetUser, characterName, action);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
