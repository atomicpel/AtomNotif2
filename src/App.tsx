import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Camera, Bell, Archive, Settings, Users, Shield, Menu, X, ScrollText } from 'lucide-react';
import { useState, useEffect } from 'react';
import CamerasPage from './pages/CamerasPage';
import EventsPage from './pages/EventsPage';
import ArchivePage from './pages/ArchivePage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import LogsPage from './pages/LogsPage';
import { getStatus } from './api';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ name: '', role: '' });
  const location = useLocation();

  useEffect(() => {
    getStatus().then(s => setUser({ name: s.user, role: s.role })).catch(() => {});
  }, []);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const allNav = [
    { path: '/', icon: Camera, label: 'Камеры', admin: false },
    { path: '/events', icon: Bell, label: 'События', admin: false },
    { path: '/archive', icon: Archive, label: 'Архив', admin: false },
    { path: '/users', icon: Users, label: 'Пользователи', admin: true },
    { path: '/logs', icon: ScrollText, label: 'Журнал', admin: true },
    { path: '/settings', icon: Settings, label: 'Настройки', admin: true },
  ];
  const nav = allNav.filter(n => !n.admin || user.role === 'admin');

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col border-r border-white/[0.06] bg-[#0d0d14]">
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-sm leading-tight">Видеонаблюдение</h1>
              <p className="text-[11px] text-gray-500">Умный дом</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 border border-transparent'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        {user.name && (
          <div className="p-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                {user.name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-[11px] text-gray-500">{user.role === 'admin' ? 'Администратор' : 'Просмотр'}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm">Камеры</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/5">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d14] border-r border-white/[0.06] flex flex-col">
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
              <span className="font-semibold">Меню</span>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <nav className="flex-1 p-3 space-y-0.5">
              {nav.map(({ path, icon: Icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                      isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </>
      )}

      {/* Main */}
      <main className="lg:ml-60 min-h-screen pb-20 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <Routes>
            <Route path="/" element={<CamerasPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d0d14]/95 backdrop-blur-xl border-t border-white/[0.06] pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around py-1.5">
          {nav.slice(0, 5).map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 min-w-[56px] ${
                  isActive ? 'text-emerald-400' : 'text-gray-500'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}
