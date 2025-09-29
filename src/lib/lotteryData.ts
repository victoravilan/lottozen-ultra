// Mock lottery data and analysis functions

export interface LotteryResult {
  date: string;
  numbers: number[];
  bonusNumbers?: number[];
  jackpot: number;
}

export interface FrequencyData {
  number: number;
  frequency: number;
  lastSeen: string;
}

// Mock historical data for different lotteries
export const MOCK_LOTTERY_RESULTS: Record<string, LotteryResult[]> = {
  euromillions: [
    { date: '2024-09-20', numbers: [7, 12, 23, 34, 45], bonusNumbers: [3, 8], jackpot: 45000000 },
    { date: '2024-09-17', numbers: [2, 15, 28, 39, 47], bonusNumbers: [1, 11], jackpot: 42000000 },
    { date: '2024-09-13', numbers: [9, 18, 25, 31, 42], bonusNumbers: [5, 9], jackpot: 38000000 },
    { date: '2024-09-10', numbers: [4, 16, 22, 35, 48], bonusNumbers: [2, 7], jackpot: 35000000 },
    { date: '2024-09-06', numbers: [11, 19, 26, 33, 44], bonusNumbers: [4, 10], jackpot: 32000000 },
  ],
  powerball: [
    { date: '2024-09-21', numbers: [8, 15, 27, 42, 58], bonusNumbers: [13], jackpot: 85000000 },
    { date: '2024-09-18', numbers: [3, 22, 35, 49, 63], bonusNumbers: [8], jackpot: 78000000 },
    { date: '2024-09-14', numbers: [12, 28, 41, 55, 67], bonusNumbers: [19], jackpot: 72000000 },
    { date: '2024-09-11', numbers: [5, 18, 32, 46, 61], bonusNumbers: [4], jackpot: 65000000 },
    { date: '2024-09-07', numbers: [14, 25, 38, 52, 69], bonusNumbers: [22], jackpot: 58000000 },
  ],
  spanish: [
    { date: '2024-09-19', numbers: [6, 13, 21, 29, 37, 45], bonusNumbers: [3], jackpot: 8000000 },
    { date: '2024-09-16', numbers: [2, 17, 24, 32, 41, 48], bonusNumbers: [7], jackpot: 7500000 },
    { date: '2024-09-12', numbers: [9, 15, 26, 34, 43, 49], bonusNumbers: [1], jackpot: 7200000 },
    { date: '2024-09-09', numbers: [4, 11, 23, 31, 39, 46], bonusNumbers: [5], jackpot: 6800000 },
    { date: '2024-09-05', numbers: [7, 18, 25, 33, 42, 47], bonusNumbers: [9], jackpot: 6500000 },
  ]
};

// Calculate frequency analysis
export function calculateFrequencyAnalysis(lotteryType: string): FrequencyData[] {
  const results = MOCK_LOTTERY_RESULTS[lotteryType] || [];
  const frequencyMap = new Map<number, { count: number, lastSeen: string }>();

  results.forEach(result => {
    result.numbers.forEach(number => {
      const current = frequencyMap.get(number) || { count: 0, lastSeen: result.date };
      frequencyMap.set(number, {
        count: current.count + 1,
        lastSeen: result.date > current.lastSeen ? result.date : current.lastSeen
      });
    });
  });

  return Array.from(frequencyMap.entries())
    .map(([number, data]) => ({
      number,
      frequency: data.count,
      lastSeen: data.lastSeen
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

// Get hot and cold numbers
export function getHotNumbers(lotteryType: string, count: number = 10): number[] {
  const frequency = calculateFrequencyAnalysis(lotteryType);
  return frequency.slice(0, count).map(item => item.number);
}

export function getColdNumbers(lotteryType: string, count: number = 10): number[] {
  const frequency = calculateFrequencyAnalysis(lotteryType);
  return frequency.slice(-count).map(item => item.number).reverse();
}

// Get latest results
export function getLatestResults(lotteryType: string, count: number = 5): LotteryResult[] {
  const results = MOCK_LOTTERY_RESULTS[lotteryType] || [];
  return results.slice(0, count);
}

// Calculate days since last appearance
export function getDaysSinceLastSeen(dateString: string): number {
  const lastSeen = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastSeen.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Generate analysis based on user numbers
export function analyzeUserNumbers(numbers: number[], lotteryType: string) {
  const hotNumbers = getHotNumbers(lotteryType);
  const coldNumbers = getColdNumbers(lotteryType);
  const frequency = calculateFrequencyAnalysis(lotteryType);

  const analysis = {
    hotNumbersCount: numbers.filter(num => hotNumbers.includes(num)).length,
    coldNumbersCount: numbers.filter(num => coldNumbers.includes(num)).length,
    averageFrequency: 0,
    riskLevel: 'Medio' as 'Bajo' | 'Medio' | 'Alto',
    recommendation: ''
  };

  // Calculate average frequency
  const userFrequencies = numbers.map(num => {
    const freq = frequency.find(f => f.number === num);
    return freq ? freq.frequency : 0;
  });
  
  analysis.averageFrequency = userFrequencies.reduce((sum, freq) => sum + freq, 0) / numbers.length;

  // Determine risk level (this is just for entertainment)
  if (analysis.hotNumbersCount >= 3) {
    analysis.riskLevel = 'Alto';
    analysis.recommendation = 'Tienes muchos números "calientes". Recuerda que esto no garantiza mayor probabilidad de ganar.';
  } else if (analysis.coldNumbersCount >= 3) {
    analysis.riskLevel = 'Bajo';
    analysis.recommendation = 'Tienes varios números "fríos". Algunos jugadores creen que están "debido" a salir, pero cada sorteo es independiente.';
  } else {
    analysis.riskLevel = 'Medio';
    analysis.recommendation = 'Tienes una mezcla equilibrada de números. Recuerda que todas las combinaciones tienen la misma probabilidad.';
  }

  return analysis;
}

// Mock function to simulate real-time lottery data
export function getNextDrawInfo(lotteryType: string) {
  const draws = {
    euromillions: { nextDraw: '2024-09-24 21:00', jackpot: 48000000 },
    powerball: { nextDraw: '2024-09-25 03:00', jackpot: 92000000 },
    spanish: { nextDraw: '2024-09-26 21:30', jackpot: 8500000 },
    megamillions: { nextDraw: '2024-09-24 23:00', jackpot: 75000000 }
  };

  return draws[lotteryType as keyof typeof draws] || { nextDraw: 'TBD', jackpot: 0 };
}