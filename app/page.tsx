'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { calculateEventTimers, EventTimer } from '@/lib/events';
import ServerWidget, { type ServerStatsSnapshot } from '@/components/layout/ServerWidget';
import { 
  Download, 
  UserPlus, 
  Trophy, 
  Clock, 
  Coins, 
  ShieldCheck, 
  Flame, 
  Swords, 
  ChevronRight,
  Sparkles,
  Award,
  Users
} from 'lucide-react';
import { MU_CLASSES } from '@/lib/mu-constants';

export default function HomePage() {
  const [events, setEvents] = useState<EventTimer[]>(() => calculateEventTimers());
  const [quickRankings, setQuickRankings] = useState<any[]>([]);
  const [serverStats, setServerStats] = useState<ServerStatsSnapshot & {
    onlinePlayers?: number;
    maxOnline?: number;
  } | null>(null);

  useEffect(() => {
    let active = true;
    let statusController: AbortController | null = null;

    // Update countdown every second
    const timerInterval = setInterval(() => {
      setEvents(calculateEventTimers());
    }, 1000);

    const loadStatus = async () => {
      statusController?.abort();
      statusController = new AbortController();

      try {
        const res = await fetch('/api/status', {
          cache: 'no-store',
          signal: statusController.signal,
        });
        const data = await res.json();
        if (active && data.success && data.stats) {
          setServerStats(data.stats);
        }
      } catch {
        // The next interval retries without interrupting the page.
      }
    };

    loadStatus();
    const statusInterval = setInterval(loadStatus, 15000);

    const loadQuickRankings = async () => {
      try {
        const res = await fetch('/api/rankings?type=resets', { cache: 'no-store' });
        const data = await res.json();
        if (active && data.success && data.data) {
          setQuickRankings(data.data.slice(0, 5));
        }
      } catch {
        // The next interval retries without interrupting the page.
      }
    };

    loadQuickRankings();
    const rankingsInterval = setInterval(loadQuickRankings, 15000);

    return () => {
      active = false;
      statusController?.abort();
      clearInterval(timerInterval);
      clearInterval(statusInterval);
      clearInterval(rankingsInterval);
    };
  }, []);

  const newsItems = [
    {
      id: 1,
      title: 'Grande Inauguração Oficial: Servidor Classic Hard 20x',
      category: 'Servidor',
      date: '10 de Outubro, 2026',
      summary: 'Os portões de Lorencia estão abertos! Venha reviver a época dourada do Mu Online Season 6 Ep. 3 com rates dinâmicos e balanceamento de classes.',
      readTime: '3 min de leitura',
    },
    {
      id: 2,
      title: 'Castle Siege: Inscrições Abertas para Guilds e Alianças',
      category: 'Guerra',
      date: '08 de Outubro, 2026',
      summary: 'A disputa pela cidadela do Valley of Loren acontece todo domingo às 20h00. Registre os Signs of Lord do seu clã no NPC Guard.',
      readTime: '2 min de leitura',
    },
    {
      id: 3,
      title: 'Atualização do Launcher 1.4 & Ativação do LiveGuard Shield',
      category: 'Segurança',
      date: '05 de Outubro, 2026',
      summary: 'Sistema anti-hack atualizado com detecção avançada de macros e bypasses de velocidade, assegurando um cenário competitivo justo.',
      readTime: '1 min de leitura',
    },
  ];

  const featuredClasses = [
    { code: 18, name: 'Blade Master', desc: 'Tanque implacável com alto DPS em combo e vida monumental.', skill: 'Death Stab & Combo Skill' },
    { code: 2, name: 'Grand Master', desc: 'Mestre elemental com magias de área massivas e teleport evasivo.', skill: 'Decay, Nova & Ice Storm' },
    { code: 34, name: 'High Elf', desc: 'Dano à distância letal com Infinity Arrow e buffs cruciais de suporte.', skill: 'Penetration & Greater Defense' },
    { code: 50, name: 'Duel Master', desc: 'Guerreiro arcano veloz com poder de usar espadas lendárias e magias.', skill: 'Fire Slash & Gigantic Storm' },
    { code: 66, name: 'Lord Emperor', desc: 'Líder supremo acompanhado do Dark Raven e Dark Horse em combate.', skill: 'Fire Burst & Chaotic Diseier' },
    { code: 82, name: 'Dimension Master', desc: 'Invocadora mística com maldições de drenagem de vida e sono.', skill: 'Reflect Damage & Chain Lightning' },
  ];

  return (
    <div className="w-full">
      {/* Hero Banner Section */}
      <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center bg-[#07080a] border-b border-[#222733] overflow-hidden">
        {/* Cinematic Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.jpg"
            alt="Mu Online Season 6 Blade Knight Hero Banner"
            fill
            priority
            referrerPolicy="no-referrer"
            className="object-cover object-center opacity-45 lg:opacity-55 scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Measured Contrast Scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Server Kicker (Clean unboxed metadata) */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <span className="text-amber-400">Temporada Oficial 2026</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">Season 6 Episode 3</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400">Hard 20x</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              Reviva a Nostalgia do <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">Mu Online</span> Clássico
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Um servidor Hard construído para quem ama a competitividade real: sem venda de itens full, economia justa de Joias, PvP refinado e guerras lendárias no Castle Siege.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/downloads"
                className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-sm rounded shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Download className="w-5 h-5 text-black" />
                <span>Baixar Cliente Completo</span>
              </Link>
              <Link
                href="/login?tab=register"
                className="flex items-center gap-2 px-6 py-3.5 bg-[#14171d]/90 hover:bg-[#1a1f28] text-white border border-[#2b3342] hover:border-amber-400/50 font-semibold text-sm rounded transition-all whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Criar Conta Gratuita</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 border-t border-[#1c212c]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Anti-Hack LiveGuard Ativo
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Coins className="w-4 h-4 text-amber-400" /> Economia Balanceada em Bless & Soul
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Flame className="w-4 h-4 text-rose-400" /> Castle Siege Todos os Domingos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Metrics Bar */}
      <section className="w-full bg-[#0d1015] border-b border-[#1c212c] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-2 border-r border-[#1a1f2a] last:border-r-0">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Jogadores Ativos</span>
              <strong className="text-xl sm:text-2xl font-extrabold text-amber-400 tabular-nums">
                {serverStats?.onlinePlayers ?? '—'} Online
              </strong>
            </div>
            <div className="p-2 border-r border-[#1a1f2a] last:border-r-0">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Taxa de Experiência</span>
              <strong className="text-xl sm:text-2xl font-extrabold text-slate-100">20x Dinâmica</strong>
            </div>
            <div className="p-2 border-r border-[#1a1f2a] last:border-r-0">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Taxa de Drop</span>
              <strong className="text-xl sm:text-2xl font-extrabold text-slate-100">20%</strong>
            </div>
            <div className="p-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Dono do Castelo</span>
              <strong className="text-xl sm:text-2xl font-extrabold text-amber-300">
                {serverStats?.castleSiegeOwner || '—'}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Split: Left (2/3 News & Events & Classes) / Right (1/3 Sidebar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Live Event Timers Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#222733] pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    Cronômetro de Eventos In-Game
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Atualizado a cada segundo</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-[#12151c] border border-[#222733] rounded-lg p-3.5 hover:border-amber-500/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <h4 className="text-sm font-semibold text-white truncate">{evt.name}</h4>
                        {evt.isOpenNow ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            Aberto
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{evt.location}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#1a1f29] flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Próximo em:</span>
                      <strong className={`text-xs tabular-nums ${evt.isOpenNow ? 'text-emerald-400' : 'text-amber-400 font-semibold'}`}>
                        {evt.timeRemainingFormatted}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* News and Updates Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#222733] pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    Notícias & Comunicados Oficiais
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Temporada 2026</span>
              </div>

              <div className="space-y-4">
                {newsItems.map((news) => (
                  <article
                    key={news.id}
                    className="bg-[#12151c] border border-[#222733] rounded-xl p-5 hover:border-amber-500/40 transition-all group"
                  >
                    {/* Unboxed clean metadata with typographic separators */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <span className="text-amber-400 font-medium">{news.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{news.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{news.readTime}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {news.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      {news.summary}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#1a1f29] flex items-center justify-between text-xs">
                      <span className="text-slate-400">Equipe Mu Online S6</span>
                      <span className="text-amber-400 flex items-center gap-1 font-medium group-hover:translate-x-1 transition-transform">
                        Ler comunicado completo <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Character Classes Showcase */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#222733] pb-3">
                <div className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    Classes Icônicas da Season 6
                  </h2>
                </div>
                <Link href="/downloads" className="text-xs text-amber-400 hover:underline">
                  Ver árvore de habilidades
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {featuredClasses.map((cls) => (
                  <div
                    key={cls.name}
                    className="bg-[#12151c] border border-[#222733] rounded-lg p-4 space-y-2 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-amber-300">{cls.name}</h4>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">3rd Class</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{cls.desc}</p>
                    <div className="pt-2 text-[11px] text-slate-400 border-t border-[#1a1f29]">
                      <span className="text-amber-400/90 font-medium">Habilidade Chave:</span> {cls.skill}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Castle Siege Feature Banner */}
            <section className="relative rounded-xl overflow-hidden border border-[#222733] p-6 lg:p-8 bg-[#10131a]">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/siege.jpg"
                  alt="Castle Siege War"
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#10131a] via-[#10131a]/85 to-transparent" />
              </div>
              <div className="relative z-10 max-w-lg space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Guerra Lendária no Valley of Loren
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  O Trono do Castelo Aguarda Sua Aliança
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Batalhas épicas com catapultas, portões de fortaleza, estátuas guardiãs e selamento da Coroa Real. Todos os domingos às 20h00.
                </p>
                <div className="pt-2">
                  <Link
                    href="/rankings?tab=siege"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded transition-colors"
                  >
                    Ver Status da Batalha & Guilds Registradas
                  </Link>
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Server Rates & Castle Siege Widget */}
            <ServerWidget serverStats={serverStats} />

            {/* Top 5 Resets Quick Ranking */}
            <div className="bg-[#12151c] border border-[#222733] rounded-xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent p-3.5 border-b border-[#222733] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold tracking-wider uppercase text-amber-300">
                    Top 5 Resets do Servidor
                  </h3>
                </div>
                <Link href="/rankings" className="text-[11px] text-amber-400 hover:underline">
                  Ver Todos
                </Link>
              </div>

              <div className="p-3">
                <div className="space-y-2">
                  {quickRankings.map((char, index) => (
                    <div
                      key={char.Name}
                      className="flex items-center justify-between p-2 rounded bg-[#0b0d11] border border-[#1a1f29] text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] ${
                            index === 0
                              ? 'bg-amber-400 text-black'
                              : index === 1
                              ? 'bg-slate-300 text-black'
                              : index === 2
                              ? 'bg-amber-700 text-white'
                              : 'bg-[#181d26] text-slate-400'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <strong className="text-slate-100 font-semibold block">{char.Name}</strong>
                          <span className="text-[10px] text-slate-400">
                            {MU_CLASSES[char.Class]?.name || 'Guerreiro'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right tabular-nums">
                        <span className="text-amber-400 font-bold block">{char.ResetCount} Resets</span>
                        <span className="text-[10px] text-slate-400">{char.m_GrandReset || 0} M. Resets</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pix Promotion Banner */}
            <div className="bg-gradient-to-br from-[#1c1810] to-[#12151c] border border-amber-500/30 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Coins className="w-5 h-5" />
                <h4 className="text-sm font-bold uppercase tracking-wider">Recargas via Pix</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aprovação automática e instantânea pelo Mercado Pago. Ganhe até <strong className="text-amber-400">+40% de bônus</strong> em WCoins para usar no CashShop in-game.
              </p>
              <Link
                href="/donate"
                className="w-full block text-center py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs rounded transition-all shadow-md shadow-amber-500/20"
              >
                Comprar WCoins c/ Bônus
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

