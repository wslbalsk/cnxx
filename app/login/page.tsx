'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Shield, Lock, User, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('tab') === 'register' ? 'register' : 'login';

  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Falha ao efetuar login.');
        }

        login(data.user);
        router.push('/dashboard');
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, email, repeatPassword }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Falha ao criar conta.');
        }

        setSuccess('Conta criada com sucesso! Redirecionando para o painel...');
        login(data.user);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <Shield className="w-6 h-6 text-black" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          {mode === 'login' ? 'Acessar Painel do Jogador' : 'Criar Nova Conta Mu Online'}
        </h1>
        <p className="text-xs text-slate-400">
          {mode === 'login'
            ? 'Digite as credenciais da sua conta in-game (MEMB_INFO)'
            : 'Preencha seus dados para começar a jogar no servidor'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-[#12151c] p-1 rounded-lg border border-[#222733]">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setError(null);
            setSuccess(null);
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
            mode === 'login'
              ? 'bg-amber-400 text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Já tenho uma conta
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setError(null);
            setSuccess(null);
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
            mode === 'register'
              ? 'bg-amber-400 text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Criar nova conta
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-[#12151c] border border-[#222733] rounded-xl p-6 shadow-xl space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">
              Nome de Usuário (Login In-game)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                maxLength={10}
                placeholder="Ex: Guerreiro99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#0b0d11] border border-[#222733] rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/60"
              />
            </div>
            <span className="text-[10px] text-slate-400">De 4 a 10 caracteres (letras e números)</span>
          </div>

          {/* Email (only in register) */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">
                Endereço de E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#0b0d11] border border-[#222733] rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/60"
                />
              </div>
              <span className="text-[10px] text-slate-400">Usado para recuperação de senha</span>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                maxLength={12}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#0b0d11] border border-[#222733] rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/60"
              />
            </div>
            <span className="text-[10px] text-slate-400">De 4 a 12 caracteres</span>
          </div>

          {/* Repeat Password (only in register) */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">Confirmar Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  maxLength={12}
                  placeholder="••••••••"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#0b0d11] border border-[#222733] rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/60"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold rounded-lg shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Processando...</span>
            ) : mode === 'login' ? (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Confirmar Cadastro</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Tip */}
        <div className="pt-3 border-t border-[#1c212c] text-[11px] text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">Contas de teste pré-configuradas:</p>
          <p>Login: <code className="text-amber-300">conqueror</code> · Senha: <code className="text-amber-300">mu123456</code></p>
          <p>Login: <code className="text-amber-300">valkyrie</code> · Senha: <code className="text-amber-300">mu123456</code></p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-slate-400">Carregando autenticação...</div>}>
      <LoginForm />
    </Suspense>
  );
}
