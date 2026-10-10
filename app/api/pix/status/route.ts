import { NextRequest, NextResponse } from 'next/server';
import { MuDatabase } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const paymentId = req.nextUrl.searchParams.get('id');
    const simulateApproval = req.nextUrl.searchParams.get('simulate') === 'true';

    if (!paymentId) {
      return NextResponse.json(
        { success: false, message: 'ID de pagamento não informado.' },
        { status: 400 }
      );
    }

    const tx = await MuDatabase.getTransaction(paymentId);

    if (!tx) {
      return NextResponse.json(
        { success: false, message: 'Transação não encontrada.' },
        { status: 404 }
      );
    }

    // Developer / Sandbox Simulation Helper
    if (simulateApproval && tx.status !== 'approved') {
      await MuDatabase.addWCoinAndLogPayment(
        tx.memb___id,
        tx.wcoin_added,
        tx.payment_id,
        tx.amount_brl
      );
      const updatedTx = await MuDatabase.getTransaction(paymentId);
      const newBalance = await MuDatabase.getShopPoints(tx.memb___id);

      return NextResponse.json({
        success: true,
        transaction: updatedTx,
        shopPoints: newBalance,
        simulated: true,
        message: 'Pagamento Pix simulado e aprovado com sucesso! WCoins creditados.',
      });
    }

    const currentPoints = await MuDatabase.getShopPoints(tx.memb___id);

    return NextResponse.json({
      success: true,
      transaction: tx,
      shopPoints: currentPoints,
      isApproved: tx.status === 'approved',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
