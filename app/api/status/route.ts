import { NextResponse } from 'next/server';
import { MuDatabase } from '@/lib/db';
import { calculateEventTimers } from '@/lib/events';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const stats = await MuDatabase.getServerStats();
    const eventTimers = calculateEventTimers();

    return NextResponse.json({
      success: true,
      stats,
      events: eventTimers,
      timestamp: new Date().toISOString(),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Não foi possível consultar o status do servidor agora.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

