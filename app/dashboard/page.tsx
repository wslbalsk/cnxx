'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserCharacter } from '@/hooks/use-auth';
import { 
  User, 
  Coins, 
  Shield, 
  Key, 
  RotateCcw, 
  Compass, 
  Skull, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Sparkles,
  MapPin,
  Flame,
  ArrowRight
} from 'lucide-react';
import { MU_CLASSES, getMapName, getPkStatus } from '@/lib/mu-constants';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, refreshUser, logout } = useAuth();

  const [selectedChar, setSelectedChar] = useState<UserCharacter | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const activeChar = selectedChar || (user?.characters && user.characters.length > 0 ? user.characters[0] : null);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center text-slate-400 text-xs">
        Carregando dados da conta...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleCharAction = async (action: 'clear_pk' | 'reset_stats' | 'unstuck') => {
    if (!activeChar) return;
    setActionLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/character/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          characterName: activeChar.Name,
          username: user.username,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Falha ao executar ação.');
      }

      setFeedback({ type: 'success', message: json.message });
      await refreshUser();
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/character/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          username: user.username,
          newPassword,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Falha ao alterar senha.');
      }

      setFeedback({ type: 'success', message: 'Senha alterada com sucesso no banco de dados!' });
      setShowPasswordModal(false);
      setNewPassword('');
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account Overview Header */}
      <div className="border-b border-[#222733] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <span>Painel do Jogador</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Gestão de Conta & Personagens</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Olá, {user.username}</span>
            <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
              Conta {user.status}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">E-mail: {user.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#12151c] hover:bg-[#1a1f28] text-slate-200 border border-[#222733] text-xs font-medium rounded transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Alterar Senha</span>
          </button>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* CashShop Balances Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* WCoinC */}
        <div className="bg-[#12151c] border border-amber-500/30 rounded-xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block">
              Saldo WCoinC (Moeda CashShop)
            </span>
            <strong className="text-2xl font-extrabold text-white tabular-nums">
              {user.shopPoints.WCoinC.toLocaleString()} WCoins
            </strong>
            <p className="text-[10px] text-slate-400">Usado para itens exclusivos, pets e VIP in-game</p>
          </div>
          <Link
            href="/donate"
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded shadow transition-all whitespace-nowrap"
          >
            + Recarregar Pix
          </Link>
        </div>

        {/* WCoinP */}
        <div className="bg-[#12151c] border border-[#222733] rounded-xl p-5 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Saldo WCoinP (Pontos de Fidelidade)
          </span>
          <strong className="text-2xl font-extrabold text-slate-200 tabular-nums">
            {user.shopPoints.WCoinP.toLocaleString()} pts
          </strong>
          <p className="text-[10px] text-slate-400">Ganhos por presença e participação em eventos</p>
        </div>

        {/* Goblin Points */}
        <div className="bg-[#12151c] border border-[#222733] rounded-xl p-5 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Goblin Points (Tempo Conectado)
          </span>
          <strong className="text-2xl font-extrabold text-emerald-400 tabular-nums">
            {user.shopPoints.GoblinPoint.toLocaleString()} GP
          </strong>
          <p className="text-[10px] text-slate-400">Acumule 1 GP a cada 10 minutos online no servidor</p>
        </div>
      </div>

      {/* Characters & Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Characters List */}
        <div className="bg-[#12151c] border border-[#222733] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222733] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              Personagens Vinculados ({user.characters.length})
            </h3>
            <span className="text-[10px] text-slate-400">Selecione para gerenciar</span>
          </div>

          <div className="space-y-2">
            {user.characters.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Nenhum personagem criado ainda. Crie seu herói in-game!
              </p>
            ) : (
              user.characters.map((char) => {
                const isSelected = activeChar?.Name === char.Name;
                const classInfo = MU_CLASSES[char.Class];
                const pkInfo = getPkStatus(char.PkLevel);
                return (
                  <button
                    key={char.Name}
                    onClick={() => setSelectedChar(char)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-[#181e28] border-amber-400/60 shadow-md'
                        : 'bg-[#0b0d11] border-[#1f2532] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-bold text-white">{char.Name}</strong>
                      <span className="text-xs font-semibold text-amber-400 tabular-nums">
                        {char.ResetCount} Resets
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span style={{ color: classInfo?.color || '#cbd5e1' }}>
                        {classInfo?.name || `Classe #${char.Class}`}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">Lv. {char.cLevel}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-[#1a1f29]">
                      <span>{getMapName(char.MapNumber)}</span>
                      <span className={pkInfo.color}>{pkInfo.label}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right (2/3): Selected Character Details & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {activeChar ? (
            <div className="space-y-6">
              {/* Character Details Card */}
              <div className="bg-[#12151c] border border-[#222733] rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#222733] pb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Personagem Selecionado
                    </span>
                    <h2 className="text-2xl font-black text-white">{activeChar.Name}</h2>
                    <p className="text-xs text-amber-400">
                      {MU_CLASSES[activeChar.Class]?.name || 'Guerreiro'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-amber-400 tabular-nums block">
                      {activeChar.ResetCount} Resets
                    </span>
                    <span className="text-xs text-slate-400 tabular-nums">
                      {activeChar.m_GrandReset || 0} Grand Resets
                    </span>
                  </div>
                </div>

                {/* Character Stats Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-[#0b0d11] p-3 rounded border border-[#1a1f29]">
                    <span className="text-slate-400 block text-[10px]">Força (Str)</span>
                    <strong className="text-slate-100 font-bold tabular-nums text-sm">
                      {activeChar.Strength.toLocaleString()}
                    </strong>
                  </div>
                  <div className="bg-[#0b0d11] p-3 rounded border border-[#1a1f29]">
                    <span className="text-slate-400 block text-[10px]">Agilidade (Agi)</span>
                    <strong className="text-slate-100 font-bold tabular-nums text-sm">
                      {activeChar.Dexterity.toLocaleString()}
                    </strong>
                  </div>
                  <div className="bg-[#0b0d11] p-3 rounded border border-[#1a1f29]">
                    <span className="text-slate-400 block text-[10px]">Vitalidade (Vit)</span>
                    <strong className="text-slate-100 font-bold tabular-nums text-sm">
                      {activeChar.Vitality.toLocaleString()}
                    </strong>
                  </div>
                  <div className="bg-[#0b0d11] p-3 rounded border border-[#1a1f29]">
                    <span className="text-slate-400 block text-[10px]">Energia (Ene)</span>
                    <strong className="text-slate-100 font-bold tabular-nums text-sm">
                      {activeChar.Energy.toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Extra Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="bg-[#0b0d11] p-3 rounded border border-[#1a1f29]">
                    <span className="text-slate-400 block text-[10px]">Localização Atual</span>
                    <strong className="text-slate-200 font-medium">
                      {getMapName(activeChar.MapNumber)} ({activeChar.MapPosX}, {activeChar.MapPosY})
                    </strong>
                  </div>
                  <div className="bg-[#0b0d11] p-3 rounded border border-[#1a1f29]">
                    <span className="text-slate-400 block text-[10px]">Status de PK</span>
                    <strong className={getPkStatus(activeChar.PkLevel).color}>
                      {getPkStatus(activeChar.PkLevel).label} ({activeChar.PkCount} mortes)
                    </strong>
                  </div>
                  <div className="bg-[#0b0d11] p-3 rounded border border-[#1a1f29]">
                    <span className="text-slate-400 block text-[10px]">Zen no Inventário</span>
                    <strong className="text-amber-400 tabular-nums">
                      {activeChar.Money.toLocaleString()} Zen
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Tools Card */}
              <div className="bg-[#12151c] border border-[#222733] rounded-xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Ferramentas Rápidas do Personagem
                </h3>
                <p className="text-xs text-slate-300">
                  Execute reparos imediatos no seu personagem sem precisar aguardar atendimento. (Certifique-se de estar deslogado do jogo ao usar).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Action 1: Clear PK */}
                  <div className="bg-[#0b0d11] p-4 rounded-lg border border-[#1a1f29] flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-1">
                        <Skull className="w-4 h-4" />
                        <span>Limpar Status PK</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Remove o status de assassino/outlaw e restaura seu personagem ao estado de Herói/Comum.
                      </p>
                    </div>
                    <button
                      disabled={actionLoading || activeChar.PkCount === 0}
                      onClick={() => handleCharAction('clear_pk')}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold text-xs rounded transition-colors"
                    >
                      {activeChar.PkCount === 0 ? 'Sem PK ativo' : 'Limpar PK Agora'}
                    </button>
                  </div>

                  {/* Action 2: Reset Stats */}
                  <div className="bg-[#0b0d11] p-4 rounded-lg border border-[#1a1f29] flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                        <RotateCcw className="w-4 h-4" />
                        <span>Resetar Atributos</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Redefine a distribuição de pontos (Força, Agilidade, Vitalidade e Energia) para redistribuir.
                      </p>
                    </div>
                    <button
                      disabled={actionLoading}
                      onClick={() => handleCharAction('reset_stats')}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold text-xs rounded transition-colors"
                    >
                      Resetar Stats
                    </button>
                  </div>

                  {/* Action 3: Unstuck / Move to Lorencia */}
                  <div className="bg-[#0b0d11] p-4 rounded-lg border border-[#1a1f29] flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-sky-400 font-bold text-xs mb-1">
                        <Compass className="w-4 h-4" />
                        <span>Desprender (Unstuck)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Mova imediatamente seu herói para o bar de Lorencia (125, 125) caso tenha travado em algum mapa.
                      </p>
                    </div>
                    <button
                      disabled={actionLoading}
                      onClick={() => handleCharAction('unstuck')}
                      className="w-full py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-semibold text-xs rounded transition-colors"
                    >
                      Mover p/ Lorencia
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Selecione um personagem na coluna ao lado.
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#12151c] border border-[#222733] rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" /> Alterar Senha da Conta
            </h3>
            <p className="text-xs text-slate-300">
              Digite a nova senha para sua conta <code className="text-amber-400">{user.username}</code>. A alteração afeta o jogo in-game imediatamente.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <input
                type="password"
                required
                minLength={4}
                maxLength={12}
                placeholder="Nova senha (4-12 caracteres)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0b0d11] border border-[#222733] rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 text-xs text-slate-300 hover:text-white bg-[#1a1f28] rounded font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2 text-xs text-black bg-amber-400 hover:bg-amber-300 rounded font-bold"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
