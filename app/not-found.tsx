import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-4xl font-extrabold text-amber-400 mb-2">404</h2>
      <p className="text-slate-300 mb-6 text-sm">Página não encontrada no servidor.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs rounded transition-colors"
      >
        Voltar para o Início
      </Link>
    </div>
  );
}
