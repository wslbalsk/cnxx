'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, MessageSquare, Send, Youtube, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#07080a] border-t border-[#1a1f29] text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Server Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm font-bold text-white tracking-wide">MU ONLINE S6</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Servidor clássico Hard Season 6 Episode 3 com economia balanceada, PvP competitivo e infraestrutura anti-hack dedicada.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-[#12151c] border border-[#222733] flex items-center justify-center text-slate-300 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
                title="Comunidade Discord"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-[#12151c] border border-[#222733] flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                title="Grupo WhatsApp"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-[#12151c] border border-[#222733] flex items-center justify-center text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                title="Canal YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Links Rápidos */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">Início & Notícias</Link>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-amber-400 transition-colors">Download do Cliente</Link>
              </li>
              <li>
                <Link href="/rankings" className="hover:text-amber-400 transition-colors">Rankings Globais</Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-amber-400 transition-colors">Recarregar WCoins (Pix)</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition-colors">Painel do Jogador</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ferramentas do Jogador */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Serviços & Suporte</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition-colors">Limpar PK In-Game</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition-colors">Resetar Atributos / Stats</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition-colors">Desprender Personagem (Unstuck)</Link>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-amber-400 transition-colors">Guia de Instalação e Drivers</Link>
              </li>
              <li>
                <Link href="/rankings?tab=siege" className="hover:text-amber-400 transition-colors">Regras do Castle Siege</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Informações do Servidor */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Infraestrutura</h4>
            <div className="bg-[#0e1117] p-3 rounded border border-[#1c212c] space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Host Dedicado:</span>
                <span className="text-slate-200">São Paulo, BR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Proteção DDoS:</span>
                <span className="text-emerald-400 font-medium">Anti-DDoS 2 Tbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Anti-Hack:</span>
                <span className="text-slate-200">LiveGuard Server v6.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Uptime Médio:</span>
                <span className="text-amber-400 font-medium">99.98%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-6 border-t border-[#181d26] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} MU ONLINE S6 Portal. Todos os direitos reservados.
          </p>
          <p className="text-slate-400 text-center sm:text-right text-[10px] max-w-xl">
            Mu Online é uma marca registrada de Webzen Inc. Este portal e servidor operam como comunidade de emulação independente sem afiliação direta.
          </p>
        </div>
      </div>
    </footer>
  );
}
