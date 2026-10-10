import { NextRequest, NextResponse } from 'next/server';
import { createPixPayment } from '@/lib/mercadopago';
import { MuDatabase } from '@/lib/db';
import { WCOIN_PACKAGES } from '@/lib/mu-constants';

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('mu_session_user')?.value;
    const body = await req.json();
    const { packageId, customAmount, username, email } = body;

    const targetAccount = sessionCookie || username;

    if (!targetAccount) {
      return NextResponse.json(
        { success: false, message: 'Você precisa estar logado para gerar um pagamento Pix.' },
        { status: 401 }
      );
    }

    // Verify account exists
    const account = await MuDatabase.findAccount(targetAccount);
    if (!account) {
      return NextResponse.json(
        { success: false, message: 'Conta de jogador não encontrada no servidor.' },
        { status: 404 }
      );
    }

    let amount = 0;
    let wcoins = 0;
    let description = '';

    const selectedPack = WCOIN_PACKAGES.find((p) => p.id === packageId);
    if (selectedPack) {
      amount = selectedPack.priceBRL;
      wcoins = selectedPack.totalWCoins;
      description = `Mu Online S6 - Pacote ${selectedPack.totalWCoins.toLocaleString()} WCoins (${account.memb___id})`;
    } else if (customAmount && Number(customAmount) >= 5) {
      amount = Number(customAmount);
      // 100 WCoins per R$ 1.00 base
      wcoins = Math.floor(amount * 100);
      description = `Mu Online S6 - Pacote Personalizado ${wcoins} WCoins (${account.memb___id})`;
    } else {
      return NextResponse.json(
        { success: false, message: 'Pacote de WCoins inválido.' },
        { status: 400 }
      );
    }

    // Call Mercado Pago SDK to generate dynamic Pix
    const pixData = await createPixPayment({
      amount: amount,
      description: description,
      playerAccount: account.memb___id,
      payerEmail: email || account.mail_addr,
      wcoinAmount: wcoins,
    });

    // Record in database table RMT_Transactions as pending
    await MuDatabase.createPendingTransaction(
      account.memb___id,
      pixData.paymentId,
      amount,
      wcoins
    );

    return NextResponse.json({
      success: true,
      data: pixData,
      message: 'Cobrança Pix gerada com sucesso!',
    });
  } catch (error) {
    console.error('[API /api/pix Error]:', error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
