// Mu Online Season 6 Episode 3 Constants and Mappings

export interface CharacterClassInfo {
  code: number;
  name: string;
  baseClass: string;
  role: string;
  tier: number;
  color: string;
}

export const MU_CLASSES: Record<number, CharacterClassInfo> = {
  // Dark Wizard line
  0: { code: 0, name: 'Dark Wizard', baseClass: 'DW', role: 'Mago Ofensivo', tier: 1, color: '#60a5fa' },
  1: { code: 1, name: 'Soul Master', baseClass: 'SM', role: 'Mago Ancestral', tier: 2, color: '#3b82f6' },
  2: { code: 2, name: 'Grand Master', baseClass: 'GM', role: 'Mestre da Magia (3rd Class)', tier: 3, color: '#2563eb' },

  // Dark Knight line
  16: { code: 16, name: 'Dark Knight', baseClass: 'DK', role: 'Guerreiro de Combate', tier: 1, color: '#f87171' },
  17: { code: 17, name: 'Blade Knight', baseClass: 'BK', role: 'Cavaleiro das Espadas', tier: 2, color: '#ef4444' },
  18: { code: 18, name: 'Blade Master', baseClass: 'BM', role: 'Mestre das Lâminas (3rd Class)', tier: 3, color: '#dc2626' },

  // Fairy Elf line
  32: { code: 32, name: 'Fairy Elf', baseClass: 'FE', role: 'Arqueira & Suporte', tier: 1, color: '#4ade80' },
  33: { code: 33, name: 'Muse Elf', baseClass: 'ME', role: 'Musa Protetora', tier: 2, color: '#22c55e' },
  34: { code: 34, name: 'High Elf', baseClass: 'HE', role: 'Alta Sacerdotisa (3rd Class)', tier: 3, color: '#16a34a' },

  // Magic Gladiator line
  48: { code: 48, name: 'Magic Gladiator', baseClass: 'MG', role: 'Híbrido Mágico-Físico', tier: 2, color: '#c084fc' },
  50: { code: 50, name: 'Duel Master', baseClass: 'DM', role: 'Mestre do Duelo (3rd Class)', tier: 3, color: '#9333ea' },

  // Dark Lord line
  64: { code: 64, name: 'Dark Lord', baseClass: 'DL', role: 'Soberano & Comandante', tier: 2, color: '#fbbf24' },
  66: { code: 66, name: 'Lord Emperor', baseClass: 'LE', role: 'Imperador das Trevas (3rd Class)', tier: 3, color: '#d97706' },

  // Summoner line
  80: { code: 80, name: 'Summoner', baseClass: 'SU', role: 'Invocadora Espiritual', tier: 1, color: '#f472b6' },
  81: { code: 81, name: 'Bloody Summoner', baseClass: 'BS', role: 'Invocadora Carmesim', tier: 2, color: '#ec4899' },
  82: { code: 82, name: 'Dimension Master', baseClass: 'DM', role: 'Mestra Dimensional (3rd Class)', tier: 3, color: '#db2777' },
};

export const MU_MAPS: Record<number, string> = {
  0: 'Lorencia',
  1: 'Dungeon',
  2: 'Devias',
  3: 'Noria',
  4: 'LostTower',
  6: 'Arena / Stadium',
  7: 'Atlans',
  8: 'Tarkan',
  10: 'Icarus',
  30: 'Valley of Loren',
  31: 'Land of Trials',
  33: 'Aida',
  34: 'Crywolf',
  37: 'Kanturu Ruins',
  38: 'Kanturu Relics',
  40: 'Silent Map',
  41: 'Balgass Barracks',
  42: 'Balgass Refuge',
  56: 'Swamp of Peace',
  57: 'Raklion',
  63: 'Vulcanus',
  64: 'Karutan 1',
  65: 'Karutan 2',
};

export function getClassName(classCode: number): string {
  return MU_CLASSES[classCode]?.name || `Classe #${classCode}`;
}

export function getMapName(mapCode: number): string {
  return MU_MAPS[mapCode] || `Mapa #${mapCode}`;
}

export function getPkStatus(pkLevel: number): { label: string; color: string } {
  switch (pkLevel) {
    case 1:
      return { label: 'Herói Lendário', color: 'text-blue-400' };
    case 2:
      return { label: 'Herói', color: 'text-sky-400' };
    case 3:
      return { label: 'Comum (Normal)', color: 'text-slate-300' };
    case 4:
      return { label: 'Aviso (Warning)', color: 'text-amber-400' };
    case 5:
      return { label: 'Assassino (Outlaw)', color: 'text-orange-500' };
    case 6:
      return { label: 'PK Máximo (Phonomania)', color: 'text-rose-500 font-bold' };
    default:
      return { label: 'Comum', color: 'text-slate-400' };
  }
}

export interface WCoinPackage {
  id: string;
  wcoins: number;
  bonusPercentage: number;
  totalWCoins: number;
  priceBRL: number;
  highlighted?: boolean;
  tag?: string;
}

export const WCOIN_PACKAGES: WCoinPackage[] = [
  {
    id: 'pack_1000',
    wcoins: 1000,
    bonusPercentage: 0,
    totalWCoins: 1000,
    priceBRL: 10.0,
    tag: 'Iniciante',
  },
  {
    id: 'pack_2750',
    wcoins: 2500,
    bonusPercentage: 10,
    totalWCoins: 2750,
    priceBRL: 25.0,
    tag: 'Popular',
  },
  {
    id: 'pack_6000',
    wcoins: 5000,
    bonusPercentage: 20,
    totalWCoins: 6000,
    priceBRL: 50.0,
    highlighted: true,
    tag: 'Mais Vendido',
  },
  {
    id: 'pack_13000',
    wcoins: 10000,
    bonusPercentage: 30,
    totalWCoins: 13000,
    priceBRL: 100.0,
    tag: 'Super Bônus',
  },
  {
    id: 'pack_28000',
    wcoins: 20000,
    bonusPercentage: 40,
    totalWCoins: 28000,
    priceBRL: 200.0,
    tag: 'VIP Supremo',
  },
];
