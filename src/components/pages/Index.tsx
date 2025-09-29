import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Dice6, BarChart3, User, Menu, X, Sparkles } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import NumberGenerator from '@/components/NumberGenerator';
import LotteryAnalysis from '@/components/LotteryAnalysis';
import UserProfile from '@/components/UserProfile';
import { UserProfile as UserProfileType } from '@/lib/numerology';

// Mock user profile data for after login
const loggedInUserProfile: UserProfileType = {
  name: 'Usuario de Prueba',
  birthDate: '1992-08-25',
  significantDates: [],
  preferredLotteries: ['euromillions'],
  spendingLimit: 100,
  currentSpending: 10
};

export default function Index() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    setUserProfile(loggedInUserProfile);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-lucky-emerald' },
    { id: 'generator', label: 'Generar', icon: Dice6, color: 'text-lucky-sapphire' },
    { id: 'analysis', label: 'Análisis', icon: BarChart3, color: 'text-lucky-amethyst' },
    { id: 'profile', label: 'Perfil', icon: User, color: 'text-lucky-gold' },
  ];

  const renderCurrentSection = () => {
    if (!userProfile) return null; // Should not happen if logic is correct

    switch (currentSection) {
      case 'dashboard':
        return <Dashboard userProfile={userProfile} onNavigate={setCurrentSection} />;
      case 'generator':
        return <NumberGenerator userProfile={userProfile} />;
      case 'analysis':
        return <LotteryAnalysis userProfile={userProfile} />;
      case 'profile':
        return <UserProfile userProfile={userProfile} onUpdateProfile={setUserProfile} />;
      default:
        return <Dashboard userProfile={userProfile} onNavigate={setCurrentSection} />;
    }
  };

  const getCurrentSectionTitle = () => {
    const section = navigationItems.find(item => item.id === currentSection);
    return section?.label || 'Dashboard';
  };

  // Render a login screen if no user is logged in
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen lucky-gradient-soft">
        <Card className="p-8 text-center shadow-2xl lucky-card">
          <CardContent>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full lucky-gradient flex items-center justify-center shadow-lg">
                <img src="/logo-lotozen-ultra.png" alt="LottoZen Ultra Logo" className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-lucky">Bienvenido a LottoZen Ultra</h1>
            <p className="text-gray-600 mb-8">Inicia sesión para ver tu dashboard personalizado.</p>
            <Button onClick={handleLogin} className="btn-lucky shadow-lg">Iniciar Sesión (Demo)</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen lucky-gradient-soft">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 text-6xl opacity-10 float-animation">🍀</div>
      <div className="fixed top-40 right-20 text-4xl opacity-10 float-animation" style={{ animationDelay: '1s' }}>⭐</div>
      <div className="fixed bottom-40 left-20 text-5xl opacity-10 float-animation" style={{ animationDelay: '2s' }}>🌟</div>
      <div className="fixed bottom-20 right-10 text-3xl opacity-10 float-animation" style={{ animationDelay: '0.5s' }}>✨</div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-white/30 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full lucky-gradient flex items-center justify-center shadow-lg lucky-number relative">
                <img src="/logo-lotozen-ultra.png" alt="LottoZen Ultra Logo" className="w-10 h-10" />
                <div className="absolute -top-1 -right-1 text-xs">✨</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-lucky">
                  LottoZen Ultra
                </h1>
                <p className="text-xs text-lucky-emerald font-medium">🍀 Juego Responsable</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => setCurrentSection(item.id)}
                    className={`flex items-center gap-2 transition-all duration-300 ${
                      isActive 
                        ? 'btn-lucky shadow-lg' 
                        : 'hover:bg-white/60 hover:shadow-md'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.color}`} />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-white/60"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* User Info */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">{userProfile.name}</div>
                <div className="text-xs text-lucky-emerald font-medium">
                  €{userProfile.currentSpending}/€{userProfile.spendingLimit}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full lucky-gradient flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/30">
              <nav className="flex flex-col gap-2 mt-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      onClick={() => {
                        setCurrentSection(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 justify-start transition-all duration-300 ${
                        isActive 
                          ? 'btn-lucky' 
                          : 'hover:bg-white/60'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.color}`} />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
              
              {/* Mobile User Info */}
              <div className="mt-4 p-4 bg-white/60 rounded-xl lucky-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full lucky-gradient flex items-center justify-center text-white font-bold shadow-lg">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{userProfile.name}</div>
                    <div className="text-sm text-lucky-emerald font-medium">
                      Gasto: €{userProfile.currentSpending}/€{userProfile.spendingLimit}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge 
              variant="secondary" 
              className="text-sm bg-white/80 text-lucky-emerald border border-white/40 shadow-md"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {getCurrentSectionTitle()}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {renderCurrentSection()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-sm border-t border-white/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full lucky-gradient flex items-center justify-center shadow-lg">
                  <img src="/logo-lotozen-ultra.png" alt="LottoZen Ultra Logo" className="w-8 h-8" />
                </div>
                <span className="font-bold text-xl text-lucky">LottoZen Ultra</span>
              </div>
              <p className="text-sm text-gray-600">
                Una aplicación de entretenimiento para generar números de lotería de forma responsable y elegante.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-lucky-emerald">🛡️ Juego Responsable</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-lucky-gold">🎯</span> Establece límites de gasto
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lucky-sapphire">🎮</span> Juega solo por entretenimiento
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lucky-amethyst">🤝</span> Busca ayuda si es necesario
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lucky-coral">🎲</span> La lotería es un juego de azar
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-lucky-sapphire">📞 Recursos de Ayuda</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-lucky-emerald">🏥</span> Jugadores Anónimos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lucky-gold">📱</span> Línea de Ayuda: 900 200 225
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lucky-amethyst">🏛️</span> FEJAR
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lucky-coral">🚫</span> Autoexclusión disponible
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/30 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              © 2024 LottoZen Ultra. Esta aplicación es solo para entretenimiento. 
              Los números generados no garantizan ningún resultado.
            </p>
            <div className="flex justify-center gap-2 text-2xl">
              <span>🍀</span><span>⭐</span><span>🌟</span><span>✨</span><span>🎯</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}