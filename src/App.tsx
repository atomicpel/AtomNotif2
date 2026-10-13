import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Camera, Bell, Archive, Users, Settings, ChevronLeft, Wifi, WifiOff, Home } from 'lucide-react';
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
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#21A038]/15 border border-[#21A038]/25">
        <div className="w-1.5 h-1.5 rounded-full bg-[#21A038] animate-pulse" />
        <span className="text-[10px] text-[#21A038] font-medium hidden sm:inline">Онлайн</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/25">
      <WifiOff className="w-3 h-3 text-amber-400" />
      <span className="text-[10px] text-amber-400 font-medium hidden sm:inline">Оффлайн</span>
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
    '/users': 'Пользователи',
    '/settings': 'Настройки',
  };

  const title = titles[location.pathname] || 'СберДом';
  const canGoBack = location.pathname !== '/';

  return (
    <header className="sticky top-0 z-30 bg-[#1c1c1e]/95 backdrop-blur-2xl border-b border-white/5 safe-top">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {canGoBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl active:bg-white/10 transition"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#21A038] to-[#1a8a2e] flex items-center justify-center shadow-lg shadow-[#21A038]/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base font-semibold text-white">{title}</h1>
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1c1c1e]/95 backdrop-blur-2xl border-t border-white/5 safe-bottom">
      <div className="flex items-center justify-around px-2 h-16 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] ${
                isActive
                  ? 'text-[#21A038]'
                  : 'text-gray-500 active:text-gray-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#21A038]/15' : ''}`}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-[#21A038]' : 'text-gray-500'}`}>
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
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      <Header />
      <main className="flex-1 pb-20">
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
