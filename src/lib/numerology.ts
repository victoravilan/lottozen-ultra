// Numerology calculation functions for lottery number generation

export interface UserProfile {
  name: string;
  birthDate: string;
  significantDates: string[];
  preferredLotteries: string[];
  spendingLimit: number;
  currentSpending: number;
}

export interface LotteryConfig {
  name: string;
  maxNumber: number;
  totalNumbers: number;
  bonusNumbers?: number;
  maxBonus?: number;
}

export const LOTTERY_CONFIGS: Record<string, LotteryConfig> = {
  euromillions: {
    name: 'EuroMillions',
    maxNumber: 50,
    totalNumbers: 5,
    bonusNumbers: 2,
    maxBonus: 12
  },
  powerball: {
    name: 'Powerball',
    maxNumber: 69,
    totalNumbers: 5,
    bonusNumbers: 1,
    maxBonus: 26
  },
  megamillions: {
    name: 'Mega Millions',
    maxNumber: 70,
    totalNumbers: 5,
    bonusNumbers: 1,
    maxBonus: 25
  },
  spanish: {
    name: 'Lotería Primitiva',
    maxNumber: 49,
    totalNumbers: 6,
    bonusNumbers: 1,
    maxBonus: 9
  }
};

// Calculate life path number from birth date
export function calculateLifePathNumber(birthDate: string): number {
  const digits = birthDate.replace(/\D/g, '');
  let sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  return sum;
}

// Generate lucky numbers based on numerology
export function generateNumerologyNumbers(profile: UserProfile, lotteryType: string): number[] {
  const config = LOTTERY_CONFIGS[lotteryType];
  if (!config) return [];

  const lifePathNumber = calculateLifePathNumber(profile.birthDate);
  const nameNumbers = profile.name.toLowerCase().split('').map(char => {
    const code = char.charCodeAt(0);
    return code >= 97 && code <= 122 ? ((code - 96) % 9) || 9 : 0;
  }).filter(n => n > 0);

  const significantNumbers = profile.significantDates.map(date => 
    calculateLifePathNumber(date)
  );

  const baseNumbers = [lifePathNumber, ...nameNumbers, ...significantNumbers];
  const numbers: number[] = [];

  // Generate main numbers
  for (let i = 0; i < config.totalNumbers; i++) {
    let num = (baseNumbers[i % baseNumbers.length] + i * 7) % config.maxNumber + 1;
    while (numbers.includes(num)) {
      num = (num % config.maxNumber) + 1;
    }
    numbers.push(num);
  }

  return numbers.sort((a, b) => a - b);
}

// Generate random numbers
export function generateRandomNumbers(lotteryType: string): number[] {
  const config = LOTTERY_CONFIGS[lotteryType];
  if (!config) return [];

  const numbers: number[] = [];
  
  while (numbers.length < config.totalNumbers) {
    const num = Math.floor(Math.random() * config.maxNumber) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }

  return numbers.sort((a, b) => a - b);
}

// Generate bonus numbers
export function generateBonusNumbers(lotteryType: string, baseNumbers?: number[]): number[] {
  const config = LOTTERY_CONFIGS[lotteryType];
  if (!config.bonusNumbers || !config.maxBonus) return [];

  const bonusNumbers: number[] = [];
  
  while (bonusNumbers.length < config.bonusNumbers) {
    const num = Math.floor(Math.random() * config.maxBonus) + 1;
    if (!bonusNumbers.includes(num)) {
      bonusNumbers.push(num);
    }
  }

  return bonusNumbers;
}

// Calculate risk percentage (mock analysis)
export function calculateRiskPercentage(numbers: number[], lotteryType: string): number {
  // This is a mock calculation for demonstration
  // In reality, all combinations have equal probability
  const config = LOTTERY_CONFIGS[lotteryType];
  if (!config) return 0;

  const totalCombinations = factorial(config.maxNumber) / 
    (factorial(config.totalNumbers) * factorial(config.maxNumber - config.totalNumbers));
  
  return (1 / totalCombinations) * 100;
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Responsible gaming messages
export const RESPONSIBLE_GAMING_MESSAGES = [
  "Recuerda: La lotería es un juego de azar. Juega solo lo que puedas permitirte perder.",
  "Establece límites de gasto y respétalos. Tu bienestar financiero es más importante.",
  "Los números del pasado no predicen el futuro. Cada sorteo es independiente.",
  "Si sientes que el juego está afectando tu vida, busca ayuda profesional.",
  "Juega por diversión, no como una forma de resolver problemas financieros.",
  "La probabilidad de ganar el premio mayor es extremadamente baja.",
  "Nunca pidas dinero prestado para jugar a la lotería.",
  "El juego debe ser entretenimiento, no una obsesión."
];

export function getRandomResponsibleMessage(): string {
  return RESPONSIBLE_GAMING_MESSAGES[Math.floor(Math.random() * RESPONSIBLE_GAMING_MESSAGES.length)];
}