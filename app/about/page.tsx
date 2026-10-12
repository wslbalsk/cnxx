'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity, BookOpen, Castle, ChevronDown, Crown, Gem, Gauge, Info,
  Layers, RefreshCw, Shield, Sparkles, Swords, Trophy, Users, Zap,
} from 'lucide-react';

type SectionId = 'overview' | 'rates' | 'reset' | 'progression' | 'guilds' | 'events' | 'items';

type ServerInfo = {
  server: Record<string, string>;
  live: {
    databaseConnected: boolean;
    onlinePlayers: number;
    maxOnline: number;
    totalAccounts: number;
    totalCharacters: number;
    totalGuilds: number;
    castleSiegeOwner: string;
    castleSiegeMaster: string;
  };
  updatedAt: string;
};

const sections: Array<{ id: SectionId; label: string; icon: typeof Info; group?: string }> = [
  { id: 'overview', label: 'Informações básicas', icon: Info, group: 'Servidor' },
  { id: 'rates', label: 'Configurações & Rates', icon: Gauge, group: 'Servidor' },
  { id: 'reset', label: 'Sistema de Reset', icon: RefreshCw, group: 'Progressão' },
  { id: 'progression', label: 'Classes e evolução', icon: Sparkles, group: 'Progressão' },
  { id: 'guilds', label: 'Guildas & Castle Siege', icon: Castle, group: 'Comunidade' },
  { id: 'events', label: 'Eventos', icon: Trophy, group: 'Conteúdo' },
  { id: 'items', label: 'Itens e Jewels', icon: Gem, group: 'Conteúdo' },
];

function InfoCard({ title, value, icon: Icon, accent = 'text-amber-300' }: { title: string; value: string; icon: typeof Info; accent?: string }) {
  return (
    <div className="rounded-xl border border-[#2b4760] bg-[#173b5a]/80 p-5 shadow-lg shadow-black/10">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-300">
        <Icon className={`h-4 w-4 ${accent}`} /> {title}
      </div>
      <div className={`mt-3 text-xl font-extrabold ${accent}`}>{value}</div>
    </div>
  );
}

export default function AboutPage() {
  const [active, setActive] = useState<SectionId>('overview');
  const [data, setData] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const response = await fetch('/api/server-info', { cache: 'no-store' });
      const json = await response.json();
      if (json.success) setData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = window.setInterval(load, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const current = useMemo(() => sections.find((section) => section.id === active) || sections[0], [active]);
  const server = data?.server;
  const live = data?.live;

  return (
    <main className="min-h-screen bg-[#0b1d2c] text-slate-100">
      <div className="mx-auto flex max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 self-start rounded-2xl border border-[#2d5878] bg-[#103553] p-3 shadow-2xl lg:block">
          <div className="mb-4 flex items-center justify-between rounded-xl bg-[#17486d] px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-bold text-yellow-300"><Shield className="h-4 w-4" /> Informações</span>
            <ChevronDown className="h-4 w-4 text-slate-300" />
          </div>
          {['Servidor', 'Progressão', 'Comunidade', 'Conteúdo'].map((group) => (
            <div key={group} className="mb-4">
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{group}</div>
              {sections.filter((section) => section.group === group).map((section) => {
                const Icon = section.icon;
                return (
                  <button key={section.id} onClick={() => setActive(section.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition ${active === section.id ? 'bg-[#2d5878] text-yellow-300' : 'text-slate-200 hover:bg-[#17486d]'}`}>
                    <Icon className="h-4 w-4" /> {section.label}
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        <section className="min-w-0 flex-1 rounded-2xl border border-[#2d5878] bg-[#214964]/90 p-5 shadow-2xl sm:p-8">
          <div className="mb-6 flex flex-col gap-4 border-b border-[#4b6c83] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-yellow-300"><BookOpen className="h-4 w-4" /> Guia oficial do servidor</div>
              <h1 className="text-3xl font-black text-white sm:text-4xl">{server?.name || 'Informações do Servidor'}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200">{server?.gameplay || 'Conheça as regras, rates e sistemas que definem a experiência do servidor.'}</p>
            </div>
            <div className="rounded-lg border border-[#53758d] bg-[#173b5a] px-4 py-3 text-right text-xs">
              <div className="flex items-center justify-end gap-2 text-slate-300"><span className={`h-2 w-2 rounded-full ${live?.databaseConnected ? 'bg-emerald-400' : 'bg-rose-400'}`} /> Dados do servidor</div>
              <div className="mt-1 font-semibold text-yellow-300">{data?.updatedAt ? `Atualizado ${new Date(data.updatedAt).toLocaleTimeString('pt-BR')}` : 'Consultando...'}</div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InfoCard title="Jogadores ativos" value={`${live?.onlinePlayers ?? '—'} / ${live?.maxOnline ?? '—'}`} icon={Activity} accent="text-emerald-300" />
            <InfoCard title="Versão" value={server?.version || '—'} icon={Layers} />
            <InfoCard title="Contas" value={String(live?.totalAccounts ?? '—')} icon={Users} accent="text-sky-300" />
            <InfoCard title="Personagens" value={String(live?.totalCharacters ?? '—')} icon={Swords} accent="text-violet-300" />
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
            {sections.map((section) => <button key={section.id} onClick={() => setActive(section.id)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold ${active === section.id ? 'bg-yellow-300 text-slate-900' : 'bg-[#173b5a] text-slate-200'}`}>{section.label}</button>)}
          </div>

          <div className="rounded-xl border border-[#4b6c83] bg-[#193d5b]/80 p-5 sm:p-7">
            <h2 className="mb-5 text-2xl font-black text-yellow-300">{current.label}</h2>
            {active === 'overview' && <div className="space-y-5 text-sm leading-7 text-slate-100"><p>Este painel reúne as informações oficiais e os indicadores atuais do servidor. Os contadores são consultados no SQL Server e atualizados automaticamente.</p><div className="grid gap-4 sm:grid-cols-3"><InfoCard title="Guildas" value={String(live?.totalGuilds ?? '—')} icon={Users} accent="text-amber-300" /><InfoCard title="Castle Siege" value={live?.castleSiegeOwner || '—'} icon={Crown} accent="text-rose-300" /><InfoCard title="Guild Master" value={live?.castleSiegeMaster || '—'} icon={Castle} accent="text-sky-300" /></div></div>}
            {active === 'rates' && <div className="grid gap-3 sm:grid-cols-2">{[['Versão', server?.version], ['Experiência geral', server?.experience], ['Master Exp', server?.masterExperience], ['Drop Rate', server?.dropRate], ['Nível máximo', server?.maxLevel], ['Reset máximo', server?.maxReset], ['Pontos por reset', server?.resetPoints], ['Bug Bless', server?.bugBless], ['Spawn de monstros', server?.monsterSpawn]].map(([label, value]) => <div key={label} className="flex items-center justify-between border-b border-[#41647b] py-3 text-sm"><span className="text-slate-300">{label}</span><strong className="text-yellow-300">{value || 'Não configurado'}</strong></div>)}</div>}
            {active === 'reset' && <div className="space-y-4 text-sm leading-7 text-slate-100"><p>O sistema de reset e seus requisitos são definidos pelo emulador. Os limites abaixo refletem a configuração publicada para este servidor.</p><div className="grid gap-4 sm:grid-cols-3"><InfoCard title="Reset máximo" value={server?.maxReset || '—'} icon={RefreshCw} /><InfoCard title="Pontos" value={server?.resetPoints || '—'} icon={Zap} /><InfoCard title="Nível máximo" value={server?.maxLevel || '—'} icon={Gauge} /></div><p className="text-xs text-slate-300">A tabela detalhada de requisitos será exibida quando a fórmula oficial de reset for cadastrada na configuração do servidor.</p></div>}
            {active === 'progression' && <div className="grid gap-4 sm:grid-cols-2"><InfoCard title="Experiência" value={server?.experience || '—'} icon={Sparkles} /><InfoCard title="Master Experience" value={server?.masterExperience || '—'} icon={Crown} /><div className="rounded-xl border border-[#2b5875] bg-[#173b5a] p-5 text-sm leading-6 text-slate-200 sm:col-span-2">Classes, árvore de Master Level e progressão serão documentadas aqui conforme a configuração oficial do emulador.</div></div>}
            {active === 'guilds' && <div className="grid gap-4 sm:grid-cols-3"><InfoCard title="Guildas registradas" value={String(live?.totalGuilds ?? '—')} icon={Users} /><InfoCard title="Guild dominante" value={live?.castleSiegeOwner || '—'} icon={Castle} /><InfoCard title="Guild Master" value={live?.castleSiegeMaster || '—'} icon={Crown} /></div>}
            {active === 'events' && <div className="rounded-xl border border-[#2b5875] bg-[#173b5a] p-5 text-sm leading-7 text-slate-200">Eventos, horários e recompensas serão publicados aqui conforme o calendário real do servidor.</div>}
            {active === 'items' && <div className="rounded-xl border border-[#2b5875] bg-[#173b5a] p-5 text-sm leading-7 text-slate-200">Itens, joias, opções e regras de comércio serão documentados aqui sem expor informações internas do GameServer.</div>}
          </div>
        </section>
      </div>
    </main>
  );
}

