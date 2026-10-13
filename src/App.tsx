import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Camera, Bell, Archive, Users, Settings, ChevronLeft, WifiOff } from 'lucide-react';
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
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] text-emerald-400 font-medium">Сервер онлайн</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
      <WifiOff className="w-3 h-3 text-orange-400" />
      <span className="text-[11px] text-orange-400 font-medium">Сервер недоступен</span>
    </div>
  );
}

const navItems = [
  { path: '/', icon: Camera, label: 'Камеры' },
  { path: '/events', icon: Bell, label: 'События' },
  { path: '/archive', icon: Archive, label: 'Архив' },
  { path: '/users', icon: Users, label: 'Пользователи' },
  { path: '/settings', icon: Settings, label: 'Настройки' },
];

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 bg-[#0f0f14] border-r border-white/5">
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">Видеонаблюдение</h1>
            <p className="text-[10px] text-gray-500">Панель управления</p>
          </div>
        </div>
      </div>
      <nav className="p-3 space-y-1 flex-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400">A</div>
          <div>
            <p className="text-xs font-medium text-white">admin</p>
            <p className="text-[10px] text-gray-500">Администратор</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const titles: Record<string, string> = {
    '/': 'Камеры',
    '/events': 'События',
    '/archive': 'Архив',
    '/users': 'Пользователи',
    '/settings': 'Настройки',
  };

  const title = titles[location.pathname] || 'Видеонаблюдение';
  const canGoBack = location.pathname !== '/';

  return (
    <header className="lg:hidden sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5 safe-top">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {canGoBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl bg-white/5 active:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
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

function DesktopHeader() {
  return (
    <header className="hidden lg:flex sticky top-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5">
      <div className="flex-1 flex items-center justify-between px-6 h-14 ml-60">
        <div />
        <ServerStatus />
      </div>
    </header>
  );
}

function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 safe-bottom">
      <div className="flex items-center justify-around px-2 h-16 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[56px] ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'text-gray-500 active:text-gray-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[10px] font-medium">{label}</span>
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
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Sidebar />
      <MobileHeader />
      <DesktopHeader />
      <main className="lg:ml-60 pb-20 lg:pb-6">
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
