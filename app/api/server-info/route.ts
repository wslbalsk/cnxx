import { NextResponse } from 'next/server';
import { MuDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const env = (key: string, fallback: string) => process.env[key] || fallback;

export async function GET() {
  try {
    const stats = await MuDatabase.getServerStats();

    return NextResponse.json({
      success: true,
      updatedAt: new Date().toISOString(),
      server: {
        name: stats.serverName,
        subtitle: stats.subTitle,
        version: stats.version,
        experience: stats.experience,
        masterExperience: env('SERVER_MASTER_EXPERIENCE', '5x'),
        dropRate: stats.dropRate,
        maxLevel: env('SERVER_MAX_LEVEL', '400'),
        maxReset: env('SERVER_MAX_RESET', '100 Resets'),
        resetPoints: env('SERVER_RESET_POINTS', 'Acumulativo (300 pts)'),
        bugBless: env('SERVER_BUG_BLESS', 'Offline (Desativado)'),
        monsterSpawn: env('SERVER_MONSTER_SPAWN', '5 a 8 monstros'),
        partyExperience: env('SERVER_PARTY_EXPERIENCE', 'Configurada no servidor'),
        gameplay: env('SERVER_GAMEPLAY_SUMMARY', 'Classic Hard com progressão competitiva.'),
      },
      live: {
        databaseConnected: stats.databaseConnected,
        onlinePlayers: stats.onlinePlayers,
        maxOnline: stats.maxOnline,
        totalAccounts: stats.totalAccounts,
        totalCharacters: stats.totalCharacters,
        totalGuilds: stats.totalGuilds,
        castleSiegeOwner: stats.castleSiegeOwner,
        castleSiegeMaster: stats.castleSiegeMaster,
      },
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Informações do servidor indisponíveis no momento.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

