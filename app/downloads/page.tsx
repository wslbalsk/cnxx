'use client';

import React from 'react';
import Link from 'next/link';
import { Download, HardDrive, Monitor, ShieldCheck, ExternalLink, Cpu, CheckCircle2 } from 'lucide-react';

export default function DownloadsPage() {
  const downloadPackages = [
    {
      id: 'full_client',
      title: 'Cliente Completo com Som & Música',
      tag: 'Recomendado para novos jogadores',
      size: '1.42 GB',
      version: 'v6.3.2 Final',
      updatedAt: '05 de Outubro, 2026',
      description: 'Instalador completo do Mu Online Season 6 contendo todos os arquivos de áudio originais (músicas de Lorencia, Noria, Devias), efeitos sonoros 3D e Launcher integrado.',
      mirrors: [
        { name: 'Google Drive', url: 'https://drive.google.com', highlight: true },
        { name: 'Mega.nz', url: 'https://mega.nz' },
        { name: 'MediaFire', url: 'https://mediafire.com' },
      ],
    },
    {
      id: 'lite_launcher',
      title: 'Launcher Oficial Auto-Update',
      tag: 'Apenas para quem já possui cliente S6',
      size: '42 MB',
      version: 'v2.1 Auto',
      updatedAt: '08 de Outubro, 2026',
      description: 'Executável leve de atualização automática. Baixa apenas as correções de interface, modelos de novos itens e proteção anti-cheat LiveGuard.',
      mirrors: [
        { name: 'Google Drive', url: 'https://drive.google.com', highlight: true },
        { name: 'MediaFire', url: 'https://mediafire.com' },
      ],
    },
    {
      id: 'drivers',
      title: 'Pacote de Drivers & Pré-Requisitos',
      tag: 'Essencial para evitar tela preta ou crash',
      size: '78 MB',
      version: 'DirectX 9.0c + VC++ Redist',
      updatedAt: 'Janeiro, 2026',
      description: 'Contém Microsoft Visual C++ 2015-2022 (x86/x64), bibliotecas do DirectX 9.0c End-User Runtimes e .NET Framework necessários para executar o jogo suavemente.',
      mirrors: [
        { name: 'Microsoft Direct', url: 'https://microsoft.com', highlight: true },
        { name: 'Google Drive', url: 'https://drive.google.com' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#222733] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
          <span>Central de Downloads</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Arquivos Oficiais Verificados</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Baixe o Cliente do Servidor
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl">
          Escolha um dos links de hospedagem de alta velocidade abaixo para baixar os arquivos do jogo. Todos os pacotes são verificados diariamente contra falsos positivos.
        </p>
      </div>

      {/* Download Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {downloadPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-[#12151c] border border-[#222733] rounded-xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-medium text-amber-400/90">{pkg.tag}</span>
                <span className="text-xs font-mono font-semibold text-slate-300 bg-[#1c222c] px-2 py-0.5 rounded">
                  {pkg.size}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{pkg.title}</h3>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3">
                <span>Versão: {pkg.version}</span>
                <span aria-hidden="true">·</span>
                <span>Atualizado: {pkg.updatedAt}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {pkg.description}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#1c222c]">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">
                Servidores de Download (Mirrors):
              </span>
              {pkg.mirrors.map((mirror) => (
                <a
                  key={mirror.name}
                  href={mirror.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-semibold transition-all ${
                    mirror.highlight
                      ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-md shadow-amber-500/20'
                      : 'bg-[#181d26] hover:bg-[#202632] text-slate-200 border border-[#28303f]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5" />
                    Baixar via {mirror.name}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* System Requirements & Setup Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Requirements Table */}
        <div className="bg-[#12151c] border border-[#222733] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#222733] pb-3">
            <Monitor className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Requisitos de Sistema</h3>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1c222c] text-slate-400">
                  <th className="py-2">Componente</th>
                  <th className="py-2">Mínimo</th>
                  <th className="py-2">Recomendado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181d26] text-slate-300">
                <tr>
                  <td className="py-2.5 font-medium text-slate-400">Sistema Operacional</td>
                  <td className="py-2.5">Windows 7 SP1 / 8</td>
                  <td className="py-2.5 text-amber-300">Windows 10 / 11 (64-bit)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-400">Processador (CPU)</td>
                  <td className="py-2.5">Intel Pentium 4 ou AMD Athlon</td>
                  <td className="py-2.5 text-amber-300">Intel Core i3 ou AMD Ryzen 3</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-400">Memória RAM</td>
                  <td className="py-2.5 tabular-nums">2 GB</td>
                  <td className="py-2.5 tabular-nums text-amber-300">4 GB ou mais</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-400">Placa de Vídeo</td>
                  <td className="py-2.5">DirectX 9.0c compatível (128MB)</td>
                  <td className="py-2.5 text-amber-300">GeForce GTX / Radeon HD ou integrada recente</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-400">Espaço em Disco</td>
                  <td className="py-2.5 tabular-nums">3 GB livres</td>
                  <td className="py-2.5 tabular-nums text-amber-300">5 GB livres em SSD</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Installation and Antivirus Tips */}
        <div className="bg-[#12151c] border border-[#222733] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#222733] pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Instalação & Dica de Antivírus</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>1. Extraia o jogo:</strong> Utilize o WinRAR ou 7-Zip para descompactar o arquivo <code className="text-amber-300">MuOnline_Season6_Full.rar</code> em uma pasta de sua preferência (ex: <code className="text-slate-400">C:\Jogos\MuOnline</code>).
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>2. Adicione às Exceções do Windows Defender:</strong> Por conter proteção anti-cheat em nível de kernel (LiveGuard), o Windows pode emitir alerta de falso positivo. Adicione a pasta do jogo na lista de exclusões do seu antivírus.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>3. Execute como Administrador:</strong> Abra o arquivo <code className="text-amber-300">Launcher.exe</code> como Administrador para que as atualizações automáticas sejam aplicadas com sucesso.
              </p>
            </div>

            <div className="p-3 bg-[#0d1015] border border-[#1a1f29] rounded text-[11px] text-slate-400">
              Precisa de suporte com instalação? Acesse nosso canal de suporte em tempo real no Discord oficial ou fale com um Game Master (GM).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
