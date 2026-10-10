'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, Sparkles, Swords, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ServerWidgetProps {
  compact?: boolean;
}

export default function ServerWidget({ compact = false }: ServerWidgetProps) {
  const rates = [
    { label: 'Versão', value: 'Season 6 Ep. 3' },
    { label: 'Experiência Geral', value: '20x Dinâmica' },
    { label: 'Master Exp', value: '5x' },
    { label: 'Drop Rate', value: '20%' },
    { label: 'Reset Máximo', value: '100 Resets' },
    { label: 'Pontos p/ Reset', value: 'Acumulativo (300 pts)' },
    { label: 'Bug Bless', value: 'Offline (Desativado)' },
    { label: 'Spot Monsters', value: '5 a 8 monstros' },
  ];

  if (compact) {
    return (
      <div className="bg-[#12151c] border border-[#222733] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3 border-b border-[#1f2430] pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Taxas do Servidor
          </span>
          <span className="text-[11px] text-slate-400">Hard Season 6</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {rates.slice(0, 4).map((rate) => (
            <div key={rate.label} className="bg-[#0b0d11] p-2 rounded border border-[#1a1f29]">
              <span className="text-slate-400 block text-[10px]">{rate.label}</span>
              <strong className="text-slate-200 font-semibold">{rate.value}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full space-y-5">
      {/* Server Rates Card */}
      <div className="bg-[#12151c] border border-[#222733] rounded-xl overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent p-3.5 border-b border-[#222733] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold tracking-wider uppercase text-amber-300">
              Configurações & Taxas
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Oficial S6</span>
        </div>

        <div className="p-4 space-y-2.5">
          {rates.map((rate, idx) => (
            <div
              key={rate.label}
              className={`flex items-center justify-between py-1.5 text-xs ${
                idx !== rates.length - 1 ? 'border-b border-[#181d26]' : ''
              }`}
            >
              <span className="text-slate-400">{rate.label}</span>
              <strong className="text-slate-100 font-medium text-right">{rate.value}</strong>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#0c0e12] border-t border-[#1c212c]">
          <Link
            href="/downloads"
            className="w-full block text-center py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded transition-colors"
          >
            Baixar Launcher Oficial
          </Link>
        </div>
      </div>

      {/* Castle Siege Owner Banner */}
      <div className="bg-[#12151c] border border-[#222733] rounded-xl overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-transparent p-3.5 border-b border-[#222733] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold tracking-wider uppercase text-amber-300">
              Soberanos do Castelo
            </h3>
          </div>
          <span className="text-[10px] text-rose-400 font-semibold uppercase">Valley of Loren</span>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center border border-amber-400/40 shadow-inner">
              <Crown className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Guild Detentora</span>
              <h4 className="text-base font-extrabold text-white">Valhalla</h4>
              <p className="text-xs text-amber-400/90 font-medium">GM: LordKael</p>
            </div>
          </div>

          <div className="bg-[#0b0d11] p-3 rounded-lg border border-[#1a1f29] space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Reinado:</span>
              <span className="text-slate-200 font-semibold">5 Semanas</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Próxima Batalha:</span>
              <span className="text-amber-300 font-medium">Domingo às 20h00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Aliança Ativa:</span>
              <span className="text-slate-300">Nordic Alliance</span>
            </div>
          </div>

          <Link
            href="/rankings?tab=siege"
            className="w-full block text-center py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#181c24] hover:bg-[#1f2430] border border-[#282f3d] rounded transition-colors"
          >
            Ver Detalhes do Castle Siege
          </Link>
        </div>
      </div>

      {/* Security & Shield Badge */}
      <div className="bg-[#12151c] border border-[#222733] rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h5 className="font-semibold text-slate-200">Proteção LiveGuard Anti-Cheat</h5>
          <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
            Proteção ativa contra speedhack, macros não autorizados e autopots. Jogabilidade justa garantida.
          </p>
        </div>
      </div>
    </aside>
  );
}
