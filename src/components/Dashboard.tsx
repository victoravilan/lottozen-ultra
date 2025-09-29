import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, TrendingUp, Clock, AlertTriangle, Dice6, Calculator, BarChart3, Heart } from 'lucide-react';
import { generateNumerologyNumbers, generateRandomNumbers, UserProfile, LOTTERY_CONFIGS, getRandomResponsibleMessage } from '@/lib/numerology';
import { getNextDrawInfo, getLatestResults } from '@/lib/lotteryData';

interface DashboardProps {
  userProfile: UserProfile;
  onNavigate: (section: string) => void;
}

export default function Dashboard({ userProfile, onNavigate }: DashboardProps) {
  const [luckyNumbers, setLuckyNumbers] = useState<Record<string, number[]>>({});
  const [responsibleMessage, setResponsibleMessage] = useState('');

  useEffect(() => {
    // Generate lucky numbers for preferred lotteries
    const numbers: Record<string, number[]> = {};
    userProfile.preferredLotteries.forEach(lottery => {
      numbers[lottery] = generateNumerologyNumbers(userProfile, lottery);
    });
    setLuckyNumbers(numbers);

    // Set random responsible gaming message
    setResponsibleMessage(getRandomResponsibleMessage());
  }, [userProfile]);

  const spendingPercentage = (userProfile.currentSpending / userProfile.spendingLimit) * 100;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <div className="relative">
          <h1 className="text-4xl font-bold text-lucky mb-2">
            ¡Hola, {userProfile.name}! 🌟
          </h1>
          <p className="text-lg text-gray-600">
            Aquí tienes tus números de la suerte y las últimas actualizaciones
          </p>
        </div>
      </div>

      {/* Responsible Gaming Alert */}
      <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 lucky-card">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800 font-medium">
          <span className="mr-2">🎯</span>
          {responsibleMessage}
        </AlertDescription>
      </Alert>

      {/* Spending Tracker */}
      <Card className="lucky-card lucky-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lucky-emerald">
            <TrendingUp className="h-6 w-6" />
            Control de Gastos
            <span className="text-2xl">💰</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Gastado este mes</span>
              <span className={`font-bold text-lg ${
                spendingPercentage > 80 ? 'text-red-500' : 'text-lucky-emerald'
              }`}>
                €{userProfile.currentSpending} / €{userProfile.spendingLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  spendingPercentage > 80 ? 'bg-gradient-to-r from-red-400 to-red-500' : 
                  spendingPercentage > 60 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 
                  'lucky-progress'
                }`}
                style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
              />
            </div>
            {spendingPercentage > 80 && (
              <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                <span>⚠️</span> Te estás acercando a tu límite mensual
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lucky Numbers */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-lucky">
          <Sparkles className="h-7 w-7 text-lucky-gold" />
          Tus Números de la Suerte
          <span className="text-3xl">🍀</span>
        </h2>
        
        <div className="grid gap-6">
          {userProfile.preferredLotteries.map(lottery => {
            const config = LOTTERY_CONFIGS[lottery];
            const numbers = luckyNumbers[lottery] || [];
            const nextDraw = getNextDrawInfo(lottery);
            
            return (
              <Card key={lottery} className="lucky-card hover:shadow-xl transition-all duration-300 lucky-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-lucky-sapphire flex items-center gap-2">
                        {config?.name}
                        <span className="text-2xl">🎲</span>
                      </CardTitle>
                      <CardDescription className="text-gray-600 font-medium">
                        Basados en tu perfil numerológico ✨
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-2 bg-white/80 border-lucky-gold text-lucky-gold">
                      <Clock className="h-3 w-3" />
                      {nextDraw.nextDraw}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {numbers.map((number, index) => (
                        <div
                          key={index}
                          className="w-14 h-14 rounded-full lucky-gradient text-white flex items-center justify-center font-bold text-lg shadow-lg lucky-number relative sparkle transition-transform hover:scale-110"
                        >
                          {number}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Próximo bote:</span>
                      <span className="text-lucky-emerald font-bold text-lg flex items-center gap-1">
                        <span>💎</span>
                        €{nextDraw.jackpot.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="cursor-pointer lucky-card hover:shadow-xl transition-all duration-300 group" 
          onClick={() => onNavigate('generator')}
        >
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full lucky-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Dice6 className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-lg text-lucky-sapphire mb-2">Generar Números</h3>
            <p className="text-sm text-gray-600">Nuevas combinaciones de la suerte 🎯</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer lucky-card hover:shadow-xl transition-all duration-300 group" 
          onClick={() => onNavigate('analysis')}
        >
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-lg text-lucky-emerald mb-2">Análisis</h3>
            <p className="text-sm text-gray-600">Datos históricos y tendencias 📊</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer lucky-card hover:shadow-xl transition-all duration-300 group" 
          onClick={() => onNavigate('profile')}
        >
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-lg text-lucky-amethyst mb-2">Mi Perfil</h3>
            <p className="text-sm text-gray-600">Configuración personal ⚙️</p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Results Preview */}
      <Card className="lucky-card lucky-border">
        <CardHeader>
          <CardTitle className="text-lucky-sapphire flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            Últimos Resultados
          </CardTitle>
          <CardDescription className="text-gray-600">
            Resultados más recientes de tus loterías preferidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {userProfile.preferredLotteries.slice(0, 2).map(lottery => {
              const config = LOTTERY_CONFIGS[lottery];
              const latestResult = getLatestResults(lottery, 1)[0];
              
              if (!latestResult) return null;
              
              return (
                <div key={lottery} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lucky-emerald">{config?.name}</span>
                    <Badge variant="outline" className="text-lucky-gold border-lucky-gold">
                      {latestResult.date}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {latestResult.numbers.map((number, index) => (
                        <div
                          key={index}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 shadow-md"
                        >
                          {number}
                        </div>
                      ))}
                    </div>
                    {latestResult.bonusNumbers && (
                      <>
                        <Separator orientation="vertical" className="h-10" />
                        <div className="flex gap-2">
                          {latestResult.bonusNumbers.map((number, index) => (
                            <div
                              key={index}
                              className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-100 to-amber-200 flex items-center justify-center text-sm font-bold text-amber-700 shadow-md"
                            >
                              {number}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert className="lucky-card border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <Heart className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>💫 Importante:</strong> Los números mostrados son generados para entretenimiento. 
          La lotería es un juego de azar y todas las combinaciones tienen la misma probabilidad de ganar.
          <span className="ml-2">🎲✨</span>
        </AlertDescription>
      </Alert>
    </div>
  );
}