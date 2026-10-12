'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Shield, Coins, User, LogOut, Menu, X, Radio } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [maxOnline, setMaxOnline] = useState(1500);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    let active = true;
    let controller: AbortController | null = null;

    const loadStatus = async () => {
      controller?.abort();
      controller = new AbortController();

      try {
        const res = await fetch('/api/status', {
          cache: 'no-store',
          signal: controller.signal,
        });
        const data = await res.json();
        if (active && data.success && data.stats) {
          setOnlineCount(Number(data.stats.onlinePlayers ?? 0));
          setMaxOnline(Number(data.stats.maxOnline ?? 1500));
          setServerOnline(Boolean(data.stats.databaseConnected));
        }
      } catch {
        if (active) {
          setServerOnline(false);
        }
      }
    };

    loadStatus();
    const interval = window.setInterval(loadStatus, 15000);

    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { label: 'Início', href: '/' },
    { label: 'Servidor', href: '/about' },
    { label: 'Downloads', href: '/downloads' },
    { label: 'Rankings', href: '/rankings' },
    { label: 'WebShop / Doar', href: '/donate' },
    { label: 'Painel do Jogador', href: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#09090b]/95 backdrop-blur-md border-b border-[#222733]">
      {/* Real-time Server Live Ticker */}
      <div className="bg-[#0f1218] border-b border-[#1c212c] px-4 py-1 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <span className={`inline-block w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              ConnectServer: <span className="text-emerald-400">{serverOnline ? 'Online' : 'Offline'}</span>
            </span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span className="hidden sm:inline text-slate-300">GameServer Sub-1: <span className="text-emerald-400">PVP (Normal)</span></span>
            <span className="hidden md:inline text-slate-600">·</span>
            <span className="hidden md:inline text-slate-300">GameServer Sub-2: <span className="text-sky-400">VIP Gold</span></span>
          </div>
          <div className="flex items-center gap-3 tabular-nums">
            <span className="text-slate-400">
              Jogadores Online: <strong className="text-amber-400 font-semibold">{onlineCount ?? '—'}</strong> / {maxOnline}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 hidden sm:inline">Versão: <strong className="text-slate-200">S6 Ep. 3</strong></span>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Links) - Zone 3 (Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
            <div className="w-9 h-9 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
                MU ONLINE S6
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase -mt-1">
                Classic Hard 20x
              </span>
            </div>
          </Link>

          {/* Zone 2: 4-5 Concise Single-line Nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                    isActive
                      ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/donate"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold tabular-nums transition-colors whitespace-nowrap"
                  title="Recarregar WCoins via Pix"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>{user.shopPoints.WCoinC.toLocaleString()} WCoins</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-[#181c24] hover:bg-[#202530] text-slate-200 border border-[#2b3240] rounded text-xs font-medium transition-colors whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.username}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Sair da Conta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#14171d] hover:bg-[#1a1f28] border border-[#262c38] rounded transition-colors whitespace-nowrap"
                >
                  Entrar
                </Link>
                <Link
                  href="/login?tab=register"
                  className="px-4 py-2 text-xs font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded shadow-md shadow-amber-500/20 transition-all whitespace-nowrap"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1c212c] bg-[#0c0e12] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm rounded transition-colors ${
                pathname === link.href
                  ? 'bg-amber-500/10 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:bg-[#151922]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#1c212c]">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs px-3 text-slate-400">
                  <span>Logado como: <strong className="text-white">{user.username}</strong></span>
                  <span className="text-amber-400 tabular-nums">{user.shopPoints.WCoinC} WCoins</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded"
                >
                  Encerrar Sessão
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-medium text-slate-200 bg-[#14171d] border border-[#262c38] rounded"
                >
                  Entrar
                </Link>
                <Link
                  href="/login?tab=register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-semibold text-black bg-amber-400 rounded"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

