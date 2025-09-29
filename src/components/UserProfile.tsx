import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Calendar, Heart, Euro, Shield, Plus, Trash2, Save, AlertTriangle } from 'lucide-react';
import { UserProfile as UserProfileType, LOTTERY_CONFIGS } from '@/lib/numerology';

interface UserProfileProps {
  userProfile: UserProfileType;
  onUpdateProfile: (profile: UserProfileType) => void;
}

export default function UserProfile({ userProfile, onUpdateProfile }: UserProfileProps) {
  const [formData, setFormData] = useState<UserProfileType>(userProfile);
  const [newSignificantDate, setNewSignificantDate] = useState('');
  const [dateDescription, setDateDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onUpdateProfile(formData);
    setIsSaving(false);
  };

  const addSignificantDate = () => {
    if (newSignificantDate && dateDescription) {
      const dateWithDescription = `${newSignificantDate} (${dateDescription})`;
      setFormData({
        ...formData,
        significantDates: [...formData.significantDates, dateWithDescription]
      });
      setNewSignificantDate('');
      setDateDescription('');
    }
  };

  const removeSignificantDate = (index: number) => {
    setFormData({
      ...formData,
      significantDates: formData.significantDates.filter((_, i) => i !== index)
    });
  };

  const toggleLottery = (lotteryKey: string) => {
    const isSelected = formData.preferredLotteries.includes(lotteryKey);
    if (isSelected) {
      setFormData({
        ...formData,
        preferredLotteries: formData.preferredLotteries.filter(l => l !== lotteryKey)
      });
    } else {
      setFormData({
        ...formData,
        preferredLotteries: [...formData.preferredLotteries, lotteryKey]
      });
    }
  };

  const spendingPercentage = (formData.currentSpending / formData.spendingLimit) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Configura tu información personal y preferencias
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Información Personal
          </CardTitle>
          <CardDescription>
            Esta información se usa para cálculos numerológicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Significant Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Fechas Significativas
          </CardTitle>
          <CardDescription>
            Añade fechas importantes que quieras incluir en tus cálculos numerológicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Dates */}
          {formData.significantDates.length > 0 && (
            <div className="space-y-2">
              <Label>Fechas Guardadas</Label>
              {formData.significantDates.map((date, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm">{date}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSignificantDate(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Date */}
          <div className="space-y-3 p-4 border rounded-lg">
            <Label>Añadir Nueva Fecha</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                type="date"
                value={newSignificantDate}
                onChange={(e) => setNewSignificantDate(e.target.value)}
                placeholder="Fecha"
              />
              <Input
                value={dateDescription}
                onChange={(e) => setDateDescription(e.target.value)}
                placeholder="Descripción (ej: Aniversario, Graduación)"
              />
            </div>
            <Button 
              onClick={addSignificantDate}
              disabled={!newSignificantDate || !dateDescription}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir Fecha
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferred Lotteries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            Loterías Preferidas
          </CardTitle>
          <CardDescription>
            Selecciona las loterías que te interesan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(LOTTERY_CONFIGS).map(([key, config]) => (
              <div key={key} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={key}
                  checked={formData.preferredLotteries.includes(key)}
                  onCheckedChange={() => toggleLottery(key)}
                />
                <div className="flex-1">
                  <Label htmlFor={key} className="font-medium cursor-pointer">
                    {config.name}
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    {config.totalNumbers} números (1-{config.maxNumber})
                    {config.bonusNumbers && ` + ${config.bonusNumbers} bonus`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spending Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5 text-yellow-500" />
            Control de Gastos
          </CardTitle>
          <CardDescription>
            Establece límites para jugar de forma responsable
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="spendingLimit">Límite Mensual (€)</Label>
              <Input
                id="spendingLimit"
                type="number"
                min="0"
                value={formData.spendingLimit}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  spendingLimit: parseFloat(e.target.value) || 0 
                })}
              />
            </div>
            <div>
              <Label htmlFor="currentSpending">Gasto Actual (€)</Label>
              <Input
                id="currentSpending"
                type="number"
                min="0"
                value={formData.currentSpending}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  currentSpending: parseFloat(e.target.value) || 0 
                })}
              />
            </div>
          </div>

          {/* Spending Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso del gasto</span>
              <span className={spendingPercentage > 80 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                {spendingPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all ${
                  spendingPercentage > 80 ? 'bg-red-500' : 
                  spendingPercentage > 60 ? 'bg-amber-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
              />
            </div>
            {spendingPercentage > 80 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Te estás acercando a tu límite mensual. Considera reducir tus gastos en lotería.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Responsible Gaming */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            Juego Responsable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Recuerda:</strong> La lotería debe ser entretenimiento, no una forma de resolver problemas financieros.
              Si sientes que el juego está afectando tu vida, busca ayuda profesional.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="font-semibold">Recursos de Ayuda</h4>
            <div className="space-y-1 text-sm">
              <div>• <strong>Jugadores Anónimos:</strong> www.jugadoresanonimos.org</div>
              <div>• <strong>Línea de Ayuda:</strong> 900 200 225</div>
              <div>• <strong>FEJAR:</strong> Federación Española de Jugadores de Azar Rehabilitados</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-semibold">Consejos para Jugar Responsablemente</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Establece un presupuesto y respétalo</li>
              <li>Nunca juegues dinero que no puedas permitirte perder</li>
              <li>No veas la lotería como una inversión</li>
              <li>Toma descansos regulares</li>
              <li>Busca ayuda si sientes que pierdes el control</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={handleSave} 
            className="w-full" 
            size="lg"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Perfil
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formData.significantDates.length + 1}
              </div>
              <div className="text-sm text-muted-foreground">
                Fechas importantes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formData.preferredLotteries.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Loterías preferidas
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                €{formData.spendingLimit}
              </div>
              <div className="text-sm text-muted-foreground">
                Límite mensual
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                spendingPercentage > 80 ? 'text-red-600' : 'text-green-600'
              }`}>
                {spendingPercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Gasto actual
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}