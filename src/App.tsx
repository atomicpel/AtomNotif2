import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Camera, Bell, Archive, Users, Settings, ChevronLeft, Wifi, WifiOff } from 'lucide-react';
import CamerasPage from './pages/CamerasPage';
import EventsPage from './pages/EventsPage';
import ArchivePage from './pages/ArchivePage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import { useState, useEffect } from 'react';
import { API_BASE, checkConnection } from './api';

function ServerStatus() {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    checkConnection().then(setConnected);
    const interval = setInterval(() => checkConnection().then(setConnected), 30000);
    return () => clearInterval(interval);
  }, []);

  if (connected === null) return null;

  if (connected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-xl">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50" />
        <span className="text-xs text-emerald-300 font-medium hidden sm:inline">Онлайн</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 backdrop-blur-xl">
      <WifiOff className="w-3.5 h-3.5 text-orange-400" />
      <span className="text-xs text-orange-300 font-medium hidden sm:inline">Оффлайн</span>
    </div>
  );
}

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const titles: Record<string, string> = {
    '/': 'Камеры',
    '/events': 'События',
    '/archive': 'Архив',
    '/users': 'Профиль',
    '/settings': 'Настройки',
  };

  const title = titles[location.pathname] || 'Видеонаблюдение';
  const canGoBack = location.pathname !== '/';

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/95 to-transparent backdrop-blur-2xl safe-top">
      <div className="flex items-center justify-between px-5 h-16">
        <div className="flex items-center gap-4">
          {canGoBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 active:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{title}</h1>
          </div>
        </div>
        <ServerStatus />
      </div>
    </header>
  );
}

function BottomNav() {
  const navItems = [
    { path: '/', icon: Camera, label: 'Камеры' },
    { path: '/events', icon: Bell, label: 'События' },
    { path: '/archive', icon: Archive, label: 'Архив' },
    { path: '/users', icon: Users, label: 'Профиль' },
    { path: '/settings', icon: Settings, label: 'Ещё' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/95 to-transparent backdrop-blur-2xl safe-bottom">
      <div className="flex items-center justify-around px-2 h-20 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-2xl transition-all min-w-[64px] ${
                isActive
                  ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 shadow-lg shadow-indigo-500/20'
                  : 'active:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} strokeWidth={isActive ? 2.5 : 1.5} />
                </div>
                <span className={`text-[10px] font-semibold ${isActive ? 'bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent' : 'text-gray-500'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function Layout() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <Header />
      <main className="flex-1 pb-24">
        <Routes>
          <Route path="/" element={<CamerasPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
