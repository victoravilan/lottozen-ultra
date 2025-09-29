import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Shuffle, BarChart3, Edit3, AlertTriangle, RefreshCw } from 'lucide-react';
import { 
  generateNumerologyNumbers, 
  generateRandomNumbers, 
  generateBonusNumbers,
  UserProfile, 
  LOTTERY_CONFIGS,
  calculateRiskPercentage 
} from '@/lib/numerology';
import { analyzeUserNumbers } from '@/lib/lotteryData';

interface NumberGeneratorProps {
  userProfile: UserProfile;
}

interface NumberAnalysis {
  hotNumbersCount: number;
  coldNumbersCount: number;
  averageFrequency: number;
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  recommendation: string;
}

interface GeneratedNumbers {
  main: number[];
  bonus: number[];
  mode: string;
  lottery: string;
  analysis?: NumberAnalysis;
}

export default function NumberGenerator({ userProfile }: NumberGeneratorProps) {
  const [selectedLottery, setSelectedLottery] = useState(userProfile.preferredLotteries[0] || 'euromillions');
  const [generatedNumbers, setGeneratedNumbers] = useState<GeneratedNumbers | null>(null);
  const [customNumbers, setCustomNumbers] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const lotteryConfig = LOTTERY_CONFIGS[selectedLottery];

  const generateNumbers = async (mode: string) => {
    setIsGenerating(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    let mainNumbers: number[] = [];
    
    switch (mode) {
      case 'numerology':
        mainNumbers = generateNumerologyNumbers(userProfile, selectedLottery);
        break;
      case 'random':
        mainNumbers = generateRandomNumbers(selectedLottery);
        break;
      case 'analysis':
        // For analysis mode, we'll use a mix of hot/cold numbers
        mainNumbers = generateRandomNumbers(selectedLottery);
        break;
    }

    const bonusNumbers = generateBonusNumbers(selectedLottery, mainNumbers);
    const analysis = analyzeUserNumbers(mainNumbers, selectedLottery);

    const result: GeneratedNumbers = {
      main: mainNumbers,
      bonus: bonusNumbers,
      mode,
      lottery: selectedLottery,
      analysis
    };

    setGeneratedNumbers(result);
    setIsGenerating(false);
  };

  const generateCustomNumbers = () => {
    const numbers = customNumbers.split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n >= 1 && n <= lotteryConfig.maxNumber);

    if (numbers.length !== lotteryConfig.totalNumbers) {
      alert(`Debes ingresar exactamente ${lotteryConfig.totalNumbers} números entre 1 y ${lotteryConfig.maxNumber}`);
      return;
    }

    if (new Set(numbers).size !== numbers.length) {
      alert('No puedes repetir números');
      return;
    }

    const bonusNumbers = generateBonusNumbers(selectedLottery);
    const analysis = analyzeUserNumbers(numbers, selectedLottery);

    const result: GeneratedNumbers = {
      main: numbers.sort((a, b) => a - b),
      bonus: bonusNumbers,
      mode: 'custom',
      lottery: selectedLottery,
      analysis
    };

    setGeneratedNumbers(result);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'numerology': return <Sparkles className="h-4 w-4" />;
      case 'random': return <Shuffle className="h-4 w-4" />;
      case 'analysis': return <BarChart3 className="h-4 w-4" />;
      case 'custom': return <Edit3 className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'numerology': return 'Basado en tu fecha de nacimiento y eventos significativos';
      case 'random': return 'Números completamente aleatorios';
      case 'analysis': return 'Basado en análisis de frecuencias históricas';
      case 'custom': return 'Números elegidos por ti';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Generador de Números</h1>
        <p className="text-muted-foreground">
          Genera combinaciones usando diferentes métodos
        </p>
      </div>

      {/* Lottery Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Selecciona tu Lotería</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedLottery} onValueChange={setSelectedLottery}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LOTTERY_CONFIGS).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.name} ({config.totalNumbers} números de 1-{config.maxNumber}
                  {config.bonusNumbers && ` + ${config.bonusNumbers} bonus`})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Generation Methods */}
      <Tabs defaultValue="numerology" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="numerology" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            Numerología
          </TabsTrigger>
          <TabsTrigger value="random" className="flex items-center gap-1">
            <Shuffle className="h-4 w-4" />
            Aleatorio
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            Análisis
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-1">
            <Edit3 className="h-4 w-4" />
            Personalizado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="numerology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Modo Numerológico
              </CardTitle>
              <CardDescription>
                Genera números basados en tu fecha de nacimiento y eventos significativos.
                Este método es puramente para entretenimiento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => generateNumbers('numerology')} 
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generar Números Numerológicos
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="random" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="h-5 w-5 text-blue-500" />
                Modo Aleatorio
              </CardTitle>
              <CardDescription>
                Genera números completamente al azar para una selección rápida.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => generateNumbers('random')} 
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Shuffle className="h-4 w-4 mr-2" />
                )}
                Generar Números Aleatorios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Modo Análisis
              </CardTitle>
              <CardDescription>
                Genera números considerando frecuencias históricas. 
                Recuerda que los resultados pasados no afectan los futuros.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => generateNumbers('analysis')} 
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <BarChart3 className="h-4 w-4 mr-2" />
                )}
                Generar con Análisis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-orange-500" />
                Números Personalizados
              </CardTitle>
              <CardDescription>
                Ingresa tus propios números separados por comas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-numbers">
                  Números (ej: 7, 14, 21, 28, 35{lotteryConfig.totalNumbers > 5 ? ', 42' : ''})
                </Label>
                <Input
                  id="custom-numbers"
                  placeholder={`Ingresa ${lotteryConfig.totalNumbers} números entre 1 y ${lotteryConfig.maxNumber}`}
                  value={customNumbers}
                  onChange={(e) => setCustomNumbers(e.target.value)}
                />
              </div>
              <Button onClick={generateCustomNumbers} className="w-full">
                <Edit3 className="h-4 w-4 mr-2" />
                Analizar Mis Números
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generated Numbers Display */}
      {generatedNumbers && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getModeIcon(generatedNumbers.mode)}
              Números Generados - {LOTTERY_CONFIGS[generatedNumbers.lottery].name}
            </CardTitle>
            <CardDescription>
              {getModeDescription(generatedNumbers.mode)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Numbers */}
            <div className="space-y-2">
              <Label>Números Principales</Label>
              <div className="flex flex-wrap gap-3">
                {generatedNumbers.main.map((number, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-lg"
                  >
                    {number}
                  </div>
                ))}
              </div>
            </div>

            {/* Bonus Numbers */}
            {generatedNumbers.bonus.length > 0 && (
              <div className="space-y-2">
                <Label>Números Bonus</Label>
                <div className="flex gap-3">
                  {generatedNumbers.bonus.map((number, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-lg"
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis */}
            {generatedNumbers.analysis && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Análisis de tu Combinación
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Números "Calientes"</Label>
                    <Badge variant="secondary">
                      {generatedNumbers.analysis.hotNumbersCount} de {generatedNumbers.main.length}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm">Números "Fríos"</Label>
                    <Badge variant="secondary">
                      {generatedNumbers.analysis.coldNumbersCount} de {generatedNumbers.main.length}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm">Nivel de Riesgo (Entretenimiento)</Label>
                  <Badge 
                    variant={
                      generatedNumbers.analysis.riskLevel === 'Alto' ? 'destructive' :
                      generatedNumbers.analysis.riskLevel === 'Medio' ? 'default' : 'secondary'
                    }
                  >
                    {generatedNumbers.analysis.riskLevel}
                  </Badge>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {generatedNumbers.analysis.recommendation}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={() => generateNumbers(generatedNumbers.mode)} 
                variant="outline"
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generar Otra Combinación
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Disclaimer */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Importante:</strong> Todos los métodos de generación son para entretenimiento únicamente. 
          La lotería es un juego de azar puro y ningún método puede predecir o influir en los resultados. 
          Todas las combinaciones tienen exactamente la misma probabilidad de ganar.
        </AlertDescription>
      </Alert>
    </div>
  );
}