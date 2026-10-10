export interface MuEvent {
  id: string;
  name: string;
  location: string;
  intervalHours: number;
  description: string;
  reward: string;
}

export const MU_EVENTS: MuEvent[] = [
  {
    id: 'blood_castle',
    name: 'Blood Castle',
    location: 'Bridge of Lorencia (Archangel)',
    intervalHours: 2,
    description: 'Atravesse a ponte, destrua o portão e recupere a arma sagrada do Arcanjo.',
    reward: 'Jewel of Chaos, Gemstone, Box of Kundun +4/+5',
  },
  {
    id: 'devil_square',
    name: 'Devil Square',
    location: 'Noria Event Gate',
    intervalHours: 2,
    description: 'Sobreviva a ondas incessantes de monstros demoníacos e vença a horda.',
    reward: 'Super Exp Boost, Box of Kundun, Zen',
  },
  {
    id: 'chaos_castle',
    name: 'Chaos Castle',
    location: 'Valley of Loren Entry',
    intervalHours: 2,
    description: 'Batalha Real Solo: Derrote monstros e outros jogadores enquanto o chão cai.',
    reward: 'Ancient Items, Jewel of Bless, Jewel of Soul',
  },
  {
    id: 'golden_invasion',
    name: 'Invasão dos Dragões Dourados',
    location: 'Lorencia, Devias, Noria, Atlans, Tarkan',
    intervalHours: 4,
    description: 'Dragões dourados e monstros dourados invadem os continentes!',
    reward: 'Box of Kundun +1 a +5 (Equipamentos Excellent)',
  },
  {
    id: 'crywolf',
    name: 'Fortaleza de Crywolf',
    location: 'Crywolf Fortress',
    intervalHours: 24,
    description: 'Proteja a estátua sagrada do lobo contra o exército de Balgass.',
    reward: 'Jewel of Harmony, Bônus de Servidor +10% Sucesso na Chaos Machine',
  },
  {
    id: 'castle_siege',
    name: 'Castle Siege (Batalha Semanal)',
    location: 'Valley of Loren Citadel',
    intervalHours: 168, // Weekly
    description: 'A maior guerra do servidor! Alianças disputam o trono do castelo.',
    reward: 'Controle de Land of Trials, Taxas do Servidor, Lord Crown',
  },
];

export interface EventTimer {
  id: string;
  name: string;
  location: string;
  nextTimeFormatted: string;
  timeRemainingSeconds: number;
  timeRemainingFormatted: string;
  isOpenNow: boolean;
  reward: string;
}

/**
 * Calculates current countdowns based on standard Mu Online Season 6 schedules
 */
export function calculateEventTimers(now = new Date()): EventTimer[] {
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();
  const currentDay = now.getDay(); // 0 is Sunday

  return MU_EVENTS.map((event) => {
    let secondsUntilNext = 0;
    let isOpen = false;

    if (event.id === 'blood_castle') {
      // Runs every even hour (00:00, 02:00, 04:00, etc.)
      const nextHour = (Math.floor(currentHours / 2) + 1) * 2;
      const targetDate = new Date(now);
      targetDate.setHours(nextHour, 0, 0, 0);
      const diffSec = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
      secondsUntilNext = diffSec;
      // Open during last 5 mins
      isOpen = (currentHours % 2 === 1 && currentMinutes >= 55) || (currentHours % 2 === 0 && currentMinutes < 15);
    } else if (event.id === 'devil_square') {
      // Runs every odd hour (01:00, 03:00, 05:00, etc.)
      const isOdd = currentHours % 2 === 1;
      const nextHour = isOdd ? currentHours + 2 : currentHours + 1;
      const targetDate = new Date(now);
      targetDate.setHours(nextHour, 30, 0, 0);
      if (targetDate.getTime() <= now.getTime()) {
        targetDate.setHours(nextHour + 2, 30, 0, 0);
      }
      secondsUntilNext = Math.max(0, Math.floor((targetDate.getTime() - now.getTime()) / 1000));
      isOpen = currentMinutes >= 25 && currentMinutes <= 35;
    } else if (event.id === 'chaos_castle') {
      // Runs at HH:45 every 2 hours
      const targetDate = new Date(now);
      targetDate.setMinutes(45, 0, 0);
      if (targetDate.getTime() <= now.getTime()) {
        targetDate.setHours(targetDate.getHours() + 2);
      }
      secondsUntilNext = Math.max(0, Math.floor((targetDate.getTime() - now.getTime()) / 1000));
      isOpen = currentMinutes >= 40 && currentMinutes <= 50;
    } else if (event.id === 'golden_invasion') {
      // Every 4 hours (00:00, 04:00, 08:00, 12:00, 16:00, 20:00)
      const nextBlock = Math.floor(currentHours / 4) + 1;
      const targetDate = new Date(now);
      targetDate.setHours(nextBlock * 4, 0, 0, 0);
      secondsUntilNext = Math.max(0, Math.floor((targetDate.getTime() - now.getTime()) / 1000));
      isOpen = currentMinutes < 20 && currentHours % 4 === 0;
    } else if (event.id === 'crywolf') {
      // Daily at 21:00
      const targetDate = new Date(now);
      targetDate.setHours(21, 0, 0, 0);
      if (targetDate.getTime() <= now.getTime()) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      secondsUntilNext = Math.max(0, Math.floor((targetDate.getTime() - now.getTime()) / 1000));
      isOpen = currentHours === 21 && currentMinutes < 30;
    } else if (event.id === 'castle_siege') {
      // Sundays at 20:00
      const targetDate = new Date(now);
      const daysUntilSunday = (7 - currentDay) % 7;
      targetDate.setDate(now.getDate() + daysUntilSunday);
      targetDate.setHours(20, 0, 0, 0);
      if (targetDate.getTime() <= now.getTime()) {
        targetDate.setDate(targetDate.getDate() + 7);
      }
      secondsUntilNext = Math.max(0, Math.floor((targetDate.getTime() - now.getTime()) / 1000));
      isOpen = currentDay === 0 && currentHours >= 20 && currentHours < 22;
    }

    const h = Math.floor(secondsUntilNext / 3600);
    const m = Math.floor((secondsUntilNext % 3600) / 60);
    const s = secondsUntilNext % 60;
    const formatted = `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;

    return {
      id: event.id,
      name: event.name,
      location: event.location,
      nextTimeFormatted: new Date(now.getTime() + secondsUntilNext * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      timeRemainingSeconds: secondsUntilNext,
      timeRemainingFormatted: formatted,
      isOpenNow: isOpen,
      reward: event.reward,
    };
  });
}
