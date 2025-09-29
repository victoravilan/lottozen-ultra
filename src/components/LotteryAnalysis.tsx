import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, Calendar, AlertTriangle, BarChart3, Clock, Euro } from 'lucide-react';
import { LOTTERY_CONFIGS } from '@/lib/numerology';
import { 
  getLatestResults, 
  calculateFrequencyAnalysis, 
  getHotNumbers, 
  getColdNumbers,
  getDaysSinceLastSeen,
  getNextDrawInfo,
  FrequencyData
} from '@/lib/lotteryData';

interface LotteryAnalysisProps {
  userProfile: { preferredLotteries: string[] };
}

export default function LotteryAnalysis({ userProfile }: LotteryAnalysisProps) {
  const [selectedLottery, setSelectedLottery] = useState(userProfile.preferredLotteries[0] || 'euromillions');
  const [frequencyData, setFrequencyData] = useState<FrequencyData[]>([]);

  useEffect(() => {
    const frequency = calculateFrequencyAnalysis(selectedLottery);
    setFrequencyData(frequency);
  }, [selectedLottery]);

  const lotteryConfig = LOTTERY_CONFIGS[selectedLottery];
  const latestResults = getLatestResults(selectedLottery, 5);
  const hotNumbers = getHotNumbers(selectedLottery, 10);
  const coldNumbers = getColdNumbers(selectedLottery, 10);
  const nextDraw = getNextDrawInfo(selectedLottery);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Análisis de Loterías</h1>
        <p className="text-muted-foreground">
          Datos históricos y análisis de frecuencias
        </p>
      </div>

      {/* Important Disclaimer */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Advertencia:</strong> Los datos históricos no predicen resultados futuros. 
          Cada sorteo es completamente independiente y todas las combinaciones tienen la misma probabilidad.
          Esta información es solo para entretenimiento.
        </AlertDescription>
      </Alert>

      {/* Lottery Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Selecciona Lotería para Analizar</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedLottery} onValueChange={setSelectedLottery}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LOTTERY_CONFIGS).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Next Draw Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Próximo Sorteo - {lotteryConfig?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">Fecha:</span>
              <span>{nextDraw.nextDraw}</span>
            </div>
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">Bote:</span>
              <span className="text-green-600 font-bold">
                €{nextDraw.jackpot.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Latest Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Últimos Resultados
          </CardTitle>
          <CardDescription>
            Los 5 sorteos más recientes de {lotteryConfig?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {latestResults.map((result, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{result.date}</span>
                  <Badge variant="outline">
                    €{result.jackpot.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    {result.numbers.map((number, numIndex) => (
                      <div
                        key={numIndex}
                        className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold"
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                  {result.bonusNumbers && result.bonusNumbers.length > 0 && (
                    <>
                      <Separator orientation="vertical" className="h-10" />
                      <div className="flex gap-2">
                        {result.bonusNumbers.map((number, bonusIndex) => (
                          <div
                            key={bonusIndex}
                            className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-sm font-semibold"
                          >
                            {number}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {index < latestResults.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hot and Cold Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hot Numbers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              Números "Calientes"
            </CardTitle>
            <CardDescription>
              Números que han salido con mayor frecuencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hotNumbers.slice(0, 8).map((number, index) => {
                const freq = frequencyData.find(f => f.number === number);
                return (
                  <div key={number} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-semibold">
                        {number}
                      </div>
                      <span className="text-sm">#{index + 1}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{freq?.frequency || 0} veces</div>
                      <div className="text-xs text-muted-foreground">
                        Hace {getDaysSinceLastSeen(freq?.lastSeen || '')} días
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Cold Numbers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-blue-500" />
              Números "Fríos"
            </CardTitle>
            <CardDescription>
              Números que han salido con menor frecuencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {coldNumbers.slice(0, 8).map((number, index) => {
                const freq = frequencyData.find(f => f.number === number);
                return (
                  <div key={number} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold">
                        {number}
                      </div>
                      <span className="text-sm">#{index + 1}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{freq?.frequency || 0} veces</div>
                      <div className="text-xs text-muted-foreground">
                        Hace {getDaysSinceLastSeen(freq?.lastSeen || '')} días
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Frequency Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Análisis Completo de Frecuencias
          </CardTitle>
          <CardDescription>
            Frecuencia de aparición de todos los números
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Array.from({ length: lotteryConfig?.maxNumber || 50 }, (_, i) => i + 1).map(number => {
              const freq = frequencyData.find(f => f.number === number);
              const frequency = freq?.frequency || 0;
              const isHot = hotNumbers.includes(number);
              const isCold = coldNumbers.includes(number);
              
              return (
                <div
                  key={number}
                  className={`p-2 rounded-lg border text-center ${
                    isHot ? 'bg-red-50 border-red-200' :
                    isCold ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="font-semibold">{number}</div>
                  <div className="text-xs text-muted-foreground">
                    {frequency}x
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Estadístico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {latestResults.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Sorteos analizados
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Math.max(...frequencyData.map(f => f.frequency))}
              </div>
              <div className="text-sm text-muted-foreground">
                Máxima frecuencia
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.min(...frequencyData.map(f => f.frequency))}
              </div>
              <div className="text-sm text-muted-foreground">
                Mínima frecuencia
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(frequencyData.reduce((sum, f) => sum + f.frequency, 0) / frequencyData.length).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Frecuencia promedio
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Disclaimer */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Recuerda:</strong> Este análisis es puramente estadístico y para entretenimiento. 
          Los patrones del pasado no garantizan resultados futuros. Cada número tiene exactamente 
          la misma probabilidad de salir en cada sorteo, independientemente de su historial.
        </AlertDescription>
      </Alert>
    </div>
  );
}