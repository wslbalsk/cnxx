import { NextRequest, NextResponse } from 'next/server';
import { MuDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const allowedTypes = new Set(['resets', 'level', 'master', 'guilds', 'siege'] as const);

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const requestedType = searchParams.get('type') || 'resets';
    if (!allowedTypes.has(requestedType as never)) {
      return NextResponse.json(
        { success: false, error: 'Categoria de ranking inválida.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const type = requestedType as 'resets' | 'level' | 'master' | 'guilds' | 'siege';

    const rankings = await MuDatabase.getRankings(type);

    return NextResponse.json({
      success: true,
      category: type,
      data: rankings,
      count: rankings.length,
      timestamp: new Date().toISOString(),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Não foi possível consultar o ranking agora.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

