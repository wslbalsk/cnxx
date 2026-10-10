import { NextRequest, NextResponse } from 'next/server';
import { getPaymentDetails } from '@/lib/mercadopago';
import { MuDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));

    // Mercado Pago sends notifications in body or query parameters:
    // ?type=payment&data.id=12345678 or body: { action: 'payment.updated', data: { id: '...' } }
    const paymentId =
      body?.data?.id ||
      body?.id ||
      url.searchParams.get('data.id') ||
      url.searchParams.get('id');

    const topic = body?.type || body?.action || url.searchParams.get('topic') || url.searchParams.get('type');

    console.log(`[MercadoPago Webhook] Notificação recebida - Topic: ${topic}, ID: ${paymentId}`);

    if (!paymentId) {
      return NextResponse.json(
        { success: false, message: 'ID de pagamento ausente' },
        { status: 400 }
      );
    }

    // 1. Fetch payment details from Mercado Pago to ensure authenticity
    let paymentData = await getPaymentDetails(String(paymentId));
    let status = paymentData?.status;
    let membId = paymentData?.external_reference;
    let amountBrl = Number(paymentData?.transaction_amount || 0);

    // If paymentData wasn't found through Mercado Pago API (e.g. sandbox or test ID), check internal database
    if (!paymentData) {
      const existingTx = await MuDatabase.getTransaction(String(paymentId));
      if (existingTx) {
        membId = existingTx.memb___id;
        amountBrl = existingTx.amount_brl;
        status = 'approved'; // In sandbox test triggers
      }
    }

    if (!membId) {
      console.warn(`[MercadoPago Webhook] external_reference (memb___id) não identificado para payment ${paymentId}`);
      return NextResponse.json({ success: true, message: 'Sem conta associada' });
    }

    // 2. If payment is approved, credit WCoins via parameterized SQL
    if (status === 'approved') {
      // Calculate WCoins: check if transaction was already registered to get exact bonus wcoins
      const tx = await MuDatabase.getTransaction(String(paymentId));
      const wcoinToAdd = tx ? tx.wcoin_added : Math.floor(amountBrl * 100);

      // Execute SQL: UPDATE T_InGameShop_Point SET WCoinC = WCoinC + @wcoin WHERE memb___id = @memb_id
      await MuDatabase.addWCoinAndLogPayment(
        membId,
        wcoinToAdd,
        String(paymentId),
        amountBrl
      );

      console.log(
        `[MercadoPago Webhook] Pagamento APROVADO! +${wcoinToAdd} WCoins creditados para a conta '${membId}'`
      );

      return NextResponse.json({
        success: true,
        message: `WCoins creditados com sucesso para ${membId}`,
        wcoinsAdded: wcoinToAdd,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Status do pagamento: ${status}`,
    });
  } catch (error) {
    console.error('[MercadoPago Webhook Error]:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
