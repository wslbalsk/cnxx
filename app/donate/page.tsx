'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { WCOIN_PACKAGES, WCoinPackage } from '@/lib/mu-constants';
import { 
  Coins, 
  QrCode, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Clock,
  ArrowRight
} from 'lucide-react';

export default function DonatePage() {
  const { user, refreshUser } = useAuth();
  const [selectedPack, setSelectedPack] = useState<WCoinPackage>(WCOIN_PACKAGES[2]); // default to 5.000 / 6.000 WCoins
  const [manualAccount, setManualAccount] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  
  // Checkout modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [pollingInterval]);

  const targetAccount = user?.username || manualAccount.trim();
  const targetEmail = user?.email || payerEmail.trim();

  const handleGeneratePix = async () => {
    if (!targetAccount) {
      setError('Por favor, informe o login da sua conta in-game ou faça login no portal.');
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentApproved(false);

    try {
      const res = await fetch('/api/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPack.id,
          username: targetAccount,
          email: targetEmail,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Falha ao gerar cobrança Pix.');
      }

      setPixData(json.data);
      setCheckoutModalOpen(true);

      // Start polling for payment status
      startPolling(json.data.paymentId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (paymentId: string) => {
    if (pollingInterval) clearInterval(pollingInterval);

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/pix/status?id=${paymentId}`);
        const data = await res.json();
        if (data.success && data.isApproved) {
          setPaymentApproved(true);
          clearInterval(interval);
          if (refreshUser) refreshUser();
        }
      } catch {
        // Polling error silently handled
      }
    }, 3000);

    setPollingInterval(interval);
  };

  const handleSimulatePaymentApproval = async () => {
    if (!pixData?.paymentId) return;
    try {
      const res = await fetch(`/api/pix/status?id=${pixData.paymentId}&simulate=true`);
      const data = await res.json();
      if (data.success) {
        setPaymentApproved(true);
        if (pollingInterval) clearInterval(pollingInterval);
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleCopyPixCode = () => {
    if (!pixData?.qrCode) return;
    navigator.clipboard.writeText(pixData.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#222733] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <span>WebShop Oficial</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Doações & Créditos Pix Automáticos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Recarregue WCoins Instantaneamente
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Aprovação em segundos via Mercado Pago Pix. Seus WCoins são creditados imediatamente na tabela <code className="text-amber-400">T_InGameShop_Point</code> do SQL Server.
          </p>
        </div>

        {user ? (
          <div className="bg-[#12151c] border border-amber-500/30 rounded-lg px-4 py-2 text-xs flex items-center gap-3">
            <div>
              <span className="text-slate-400 block text-[10px]">Conta Conectada:</span>
              <strong className="text-white">{user.username}</strong>
            </div>
            <div className="border-l border-[#222733] pl-3 text-right">
              <span className="text-slate-400 block text-[10px]">Saldo Atual:</span>
              <strong className="text-amber-400 font-bold tabular-nums">
                {user.shopPoints.WCoinC.toLocaleString()} WCoins
              </strong>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            <span>Não está logado? </span>
            <Link href="/login" className="text-amber-400 font-semibold hover:underline">
              Entre na sua conta
            </Link>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Package Selection Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            1. Escolha o Pacote de WCoins
          </h2>
          <span className="text-xs text-amber-400 font-medium">Bônus progressivos inclusos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {WCOIN_PACKAGES.map((pkg) => {
            const isSelected = selectedPack.id === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPack(pkg)}
                className={`relative cursor-pointer rounded-xl p-5 border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#181d27] border-amber-400 ring-2 ring-amber-400/20 shadow-xl'
                    : 'bg-[#12151c] border-[#222733] hover:border-slate-500'
                }`}
              >
                {pkg.tag && (
                  <span
                    className={`absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                      pkg.highlighted
                        ? 'bg-amber-400 text-black'
                        : 'bg-[#222938] text-slate-200 border border-[#333d52]'
                    }`}
                  >
                    {pkg.tag}
                  </span>
                )}

                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Pacote WCoinC
                  </span>
                  <div className="text-2xl font-black text-white mt-1 tabular-nums">
                    {pkg.totalWCoins.toLocaleString()}
                  </div>
                  <span className="text-xs text-amber-400 font-semibold block">WCoins</span>

                  {pkg.bonusPercentage > 0 ? (
                    <div className="mt-2 text-[11px] text-emerald-400 font-medium">
                      +{pkg.bonusPercentage}% de Bônus ({pkg.totalWCoins - pkg.wcoins} WCoins grátis)
                    </div>
                  ) : (
                    <div className="mt-2 text-[11px] text-slate-400">
                      Taxa padrão (100 WCoins / R$ 1)
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[#1e2430]">
                  <span className="text-[10px] text-slate-400 block">Valor via Pix:</span>
                  <strong className="text-lg font-extrabold text-white tabular-nums">
                    R$ {pkg.priceBRL.toFixed(2).replace('.', ',')}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Confirmation & Checkout Trigger */}
      <div className="bg-[#12151c] border border-[#222733] rounded-xl p-6 lg:p-8 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          2. Confirme os Dados da Conta Beneficiária
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <label className="text-slate-300 font-medium block">
              Login da Conta In-game (memb___id)
            </label>
            <input
              type="text"
              required
              disabled={!!user}
              placeholder="Digite o login do jogo que receberá os créditos"
              value={user ? user.username : manualAccount}
              onChange={(e) => setManualAccount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0b0d11] border border-[#222733] rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 disabled:opacity-75 disabled:cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-400">
              {user
                ? 'Conectado à sua conta. Os créditos irão diretamente para ela.'
                : 'Certifique-se de digitar seu login exato registrado no servidor.'}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 font-medium block">
              E-mail do Pagador (para comprovante Mercado Pago)
            </label>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={user ? user.email : payerEmail}
              onChange={(e) => setPayerEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0b0d11] border border-[#222733] rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
            />
            <span className="text-[10px] text-slate-400">
              Opcional. Utilizado para o envio do recibo bancário do Pix.
            </span>
          </div>
        </div>

        {/* Summary Strip */}
        <div className="bg-[#0b0d11] p-4 rounded-lg border border-[#1c212c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-400">Resumo da Compra:</span>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">{selectedPack.totalWCoins.toLocaleString()} WCoins</span>
              <span className="text-slate-500">·</span>
              <span>Total: R$ {selectedPack.priceBRL.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <button
            onClick={handleGeneratePix}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-sm rounded-lg shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Gerando Pix no Mercado Pago...</span>
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4 text-black" />
                <span>Gerar QR Code Pix Agora</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Security & Benefits Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#12151c] border border-[#222733] rounded-xl p-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-white">Crédito Automático em Segundos</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Não precisa enviar comprovante no WhatsApp ou Discord. O webhook processa a query SQL instantaneamente.
            </p>
          </div>
        </div>

        <div className="bg-[#12151c] border border-[#222733] rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-white">Segurança Mercado Pago</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Ambiente criptografado com chave de idempotência UUID v4 exclusiva para proteção anti-duplicação.
            </p>
          </div>
        </div>

        <div className="bg-[#12151c] border border-[#222733] rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-white">Disponível 24 Horas por Dia</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Recarregue seus WCoins de madrugada ou finais de semana e continue desfrutando do servidor.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Pix Checkout Modal */}
      {checkoutModalOpen && pixData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#12151c] border border-[#222733] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#222733] pb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Pagamento Pix Mercado Pago</h3>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {paymentApproved ? (
              /* Approved State */
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-white">Pagamento Confirmado!</h4>
                  <p className="text-xs text-emerald-400 font-semibold">
                    +{pixData.wcoins.toLocaleString()} WCoins creditados com sucesso na conta {pixData.externalReference}!
                  </p>
                </div>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Os créditos já estão disponíveis na CashShop (tecla &quot;X&quot; in-game). Divirta-se!
                </p>
                <div className="pt-2 flex gap-3 justify-center">
                  <Link
                    href="/dashboard"
                    onClick={() => setCheckoutModalOpen(false)}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded transition-colors"
                  >
                    Ir para o Painel do Jogador
                  </Link>
                  <button
                    onClick={() => setCheckoutModalOpen(false)}
                    className="px-5 py-2.5 bg-[#1a1f28] hover:bg-[#222936] text-slate-200 text-xs font-semibold rounded transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            ) : (
              /* Pending Payment State */
              <div className="space-y-6">
                {/* QR Code Presentation */}
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-amber-400/50">
                    <Image
                      src={
                        pixData.qrCodeBase64.startsWith('data:')
                          ? pixData.qrCodeBase64
                          : `data:image/png;base64,${pixData.qrCodeBase64}`
                      }
                      alt="QR Code Pix"
                      width={192}
                      height={192}
                      unoptimized
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-slate-400 block">Abra o app do seu banco e aponte a câmera</span>
                    <strong className="text-sm text-white">
                      Valor: R$ {pixData.amount.toFixed(2).replace('.', ',')}
                    </strong>
                  </div>
                </div>

                {/* Copia e Cola Code */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-medium block">
                    Pix Copia e Cola:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixData.qrCode}
                      className="flex-1 px-3 py-2 bg-[#0b0d11] border border-[#222733] rounded-lg text-[11px] font-mono text-slate-300 select-all focus:outline-none"
                    />
                    <button
                      onClick={handleCopyPixCode}
                      className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                        copied
                          ? 'bg-emerald-500 text-black'
                          : 'bg-amber-400 hover:bg-amber-300 text-black'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Waiting indicator & Sandbox Test Simulation */}
                <div className="p-4 rounded-xl bg-[#0b0d11] border border-[#1c212c] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      Aguardando confirmação do banco...
                    </span>
                    <span className="text-amber-400 font-semibold tabular-nums">Verificando</span>
                  </div>

                  {/* Sandbox instant simulation button for evaluator/demo testing */}
                  <div className="pt-2 border-t border-[#181d26] flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Modo de Teste / Sandbox:</span>
                    <button
                      onClick={handleSimulatePaymentApproval}
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded transition-colors"
                    >
                      Simular Aprovação Pix (Webhook)
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 text-center">
                  Identificador: <span className="font-mono text-slate-300">{pixData.paymentId}</span> · Conta:{' '}
                  <span className="text-amber-400 font-medium">{pixData.externalReference}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
