'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Trophy, Search, Shield, Crown, Swords, Users, Sparkles, RefreshCw } from 'lucide-react';
import { MU_CLASSES, getClassName } from '@/lib/mu-constants';

type TabType = 'resets' | 'level' | 'master' | 'guilds' | 'siege';

function RankingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'resets';

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/rankings?type=${activeTab}`);
        const json = await res.json();
        if (active) {
          if (json.success && json.data) {
            setData(json.data);
          } else {
            setData([]);
          }
        }
      } catch {
        if (active) setData([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [activeTab]);

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'resets', label: 'Top Resets', icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'level', label: 'Top Level', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'master', label: 'Top Master Level', icon: <Swords className="w-3.5 h-3.5" /> },
    { id: 'guilds', label: 'Top Guilds', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'siege', label: 'Castle Siege', icon: <Crown className="w-3.5 h-3.5" /> },
  ];

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if (activeTab === 'guilds') {
      return (item.Name || '').toLowerCase().includes(q) || (item.Master || '').toLowerCase().includes(q);
    }
    return (item.Name || '').toLowerCase().includes(q) || (item.GuildName || '').toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#222733] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <span>Hall da Fama</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Rankings Oficiais Season 6</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Rankings Globais de Mu Online
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Acompanhe a disputa pelas primeiras posições do servidor. Os rankings são sincronizados diretamente com o banco de dados.
          </p>
        </div>

        {/* Search Filter Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar personagem ou guilda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#12151c] border border-[#222733] rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60"
          />
        </div>
      </div>

      {/* Tabs / Filter Controls */}
      <div className="flex items-center gap-1.5 p-1 bg-[#12151c] border border-[#222733] rounded-lg overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1a1f28]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Rankings Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
          <span className="text-xs">Consultando banco de dados MuOnline...</span>
        </div>
      ) : activeTab === 'siege' ? (
        /* Castle Siege Special View */
        <div className="space-y-6">
          <div className="bg-[#12151c] border border-amber-500/30 rounded-xl p-6 lg:p-8 relative overflow-hidden">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Crown className="w-4 h-4" /> Detentores da Coroa do Castelo (Soberanos Atuais)
              </div>
              <h2 className="text-3xl font-extrabold text-white">Guild Valhalla</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="bg-[#0b0d11] p-3 rounded border border-[#1a1f29]">
                  <span className="text-slate-400 block text-[10px]">Guild Master:</span>
                  <strong className="text-white text-sm">LordKael</strong>
                </div>
                <div className="bg-[#0b0d11] p-3 rounded border border-[#1a1f29]">
                  <span className="text-slate-400 block text-[10px]">Aliança Registrada:</span>
                  <strong className="text-amber-400 text-sm">Nordic Alliance</strong>
                </div>
                <div className="bg-[#0b0d11] p-3 rounded border border-[#1a1f29]">
                  <span className="text-slate-400 block text-[10px]">Defesas Consecutivas:</span>
                  <strong className="text-emerald-400 text-sm">5 Semanas</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Registered Attackers */}
          <div className="bg-[#12151c] border border-[#222733] rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Swords className="w-4 h-4 text-amber-400" /> Guilds Desafiantes Registradas para o Próximo Cerco
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1c222c] text-slate-400">
                    <th className="py-3 px-4">Posição</th>
                    <th className="py-3 px-4">Guild</th>
                    <th className="py-3 px-4">Guild Master</th>
                    <th className="py-3 px-4">Status de Inscrição</th>
                    <th className="py-3 px-4 text-right">Signs of Lord</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181d26] text-slate-300">
                  <tr>
                    <td className="py-3 px-4 font-bold text-amber-400">#1 Atacante</td>
                    <td className="py-3 px-4 font-semibold text-white">Imperium</td>
                    <td className="py-3 px-4 text-slate-300">HighQueenSylv</td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">Inscrição Aprovada</td>
                    <td className="py-3 px-4 text-right tabular-nums font-mono text-amber-300">1.250 Signs</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">#2 Atacante</td>
                    <td className="py-3 px-4 font-semibold text-white">DragonLords</td>
                    <td className="py-3 px-4 text-slate-300">DimensionWitch</td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">Inscrição Aprovada</td>
                    <td className="py-3 px-4 text-right tabular-nums font-mono text-amber-300">890 Signs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'guilds' ? (
        /* Top Guilds Table */
        <div className="bg-[#12151c] border border-[#222733] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0f1218] border-b border-[#1c222c] text-slate-400">
                  <th className="py-3.5 px-4 w-16">#</th>
                  <th className="py-3.5 px-4">Guild</th>
                  <th className="py-3.5 px-4">Guild Master</th>
                  <th className="py-3.5 px-4">Membros</th>
                  <th className="py-3.5 px-4">Aliança</th>
                  <th className="py-3.5 px-4 text-right">Pontuação (Score)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181d26] text-slate-300">
                {filteredData.map((guild, idx) => (
                  <tr key={guild.Name} className="hover:bg-[#161a23] transition-colors">
                    <td className="py-3.5 px-4">
                      <span
                        className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                          idx === 0
                            ? 'bg-amber-400 text-black'
                            : idx === 1
                            ? 'bg-slate-300 text-black'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white text-sm">
                      {guild.Name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {guild.Master}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-slate-300">
                      {guild.Members} jogadores
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {guild.Alliance || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold font-mono text-amber-400 tabular-nums">
                      {Number(guild.Score || 0).toLocaleString()} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Character Rankings Table (Resets, Level, Master) */
        <div className="bg-[#12151c] border border-[#222733] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0f1218] border-b border-[#1c222c] text-slate-400">
                  <th className="py-3.5 px-4 w-16">#</th>
                  <th className="py-3.5 px-4">Personagem</th>
                  <th className="py-3.5 px-4">Classe</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Resets</th>
                  <th className="py-3.5 px-4">Grand Resets</th>
                  <th className="py-3.5 px-4 text-right">Guild</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181d26] text-slate-300">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Nenhum personagem encontrado para esta consulta.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((char, idx) => {
                    const classInfo = MU_CLASSES[char.Class];
                    return (
                      <tr key={char.Name} className="hover:bg-[#161a23] transition-colors">
                        <td className="py-3.5 px-4">
                          <span
                            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                              idx === 0
                                ? 'bg-amber-400 text-black'
                                : idx === 1
                                ? 'bg-slate-300 text-black'
                                : idx === 2
                                ? 'bg-amber-700 text-white'
                                : 'text-slate-400'
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white text-sm">
                          {char.Name}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className="inline-block text-[11px] font-medium px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: `${classInfo?.color || '#94a3b8'}20`,
                              color: classInfo?.color || '#cbd5e1',
                              border: `1px solid ${classInfo?.color || '#94a3b8'}40`,
                            }}
                          >
                            {classInfo?.name || `Classe #${char.Class}`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 tabular-nums font-semibold text-slate-200">
                          Lv. {char.cLevel}
                          {char.MasterLevel ? (
                            <span className="text-amber-400 text-[10px] ml-1">(ML: {char.MasterLevel})</span>
                          ) : null}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-amber-400 tabular-nums font-mono">
                          {char.ResetCount} Resets
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 tabular-nums font-mono">
                          {char.m_GrandReset || 0} GR
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-300 font-medium">
                          {char.GuildName || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RankingsPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-slate-400">Carregando rankings...</div>}>
      <RankingsContent />
    </Suspense>
  );
}
