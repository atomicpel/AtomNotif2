import { useState, useEffect } from 'react';
import { ChevronRight, Camera, Bell, Film, HardDrive, Wifi, Shield, TestTube, Info } from 'lucide-react';
import { API_BASE, checkConnection, getSettingsPageUrl, testNotification } from '../api';

export default function SettingsPage() {
  const [serverConnected, setServerConnected] = useState<boolean | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    checkConnection().then(setServerConnected);
  }, []);

  const handleTestNotify = async () => {
    setTesting(true);
    try {
      await testNotification();
    } catch {}
    setTimeout(() => setTesting(false), 2000);
  };

  const sections = [
    {
      title: 'Система',
      items: [
        { icon: Shield, label: 'Порт сайта', value: '8080', href: getSettingsPageUrl() },
        { icon: Camera, label: 'Управление камерами', value: '6 камер', href: getSettingsPageUrl() },
      ]
    },
    {
      title: 'Уведомления',
      items: [
        { icon: Bell, label: 'Telegram', value: serverConnected ? 'Настроено' : 'Не настроено', href: getSettingsPageUrl() },
        { icon: Bell, label: 'ВКонтакте', value: serverConnected ? 'Настроено' : 'Не настроено', href: getSettingsPageUrl() },
        { icon: Bell, label: 'Алиса (Яндекс)', value: serverConnected ? 'Настроено' : 'Не настроено', href: getSettingsPageUrl() },
      ]
    },
    {
      title: 'Запись',
      items: [
        { icon: Film, label: 'Видео событий', value: 'Вкл', href: getSettingsPageUrl() },
        { icon: HardDrive, label: 'Хранилище', value: '142 / 300 ГБ', href: getSettingsPageUrl() },
      ]
    },
    {
      title: 'Сеть',
      items: [
        { icon: Wifi, label: 'SSH-туннель', value: 'Настроен', href: getSettingsPageUrl() },
        { icon: Wifi, label: 'Tailscale VPN', value: 'Не настроен', href: getSettingsPageUrl() },
      ]
    },
  ];

  return (
    <div className="space-y-6 p-5">
      {/* Server status card */}
      <div className={`relative overflow-hidden rounded-3xl p-6 shadow-2xl ${
        serverConnected 
          ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 shadow-emerald-500/30' 
          : 'bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 shadow-orange-500/30'
      }`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">
              {serverConnected ? 'Сервер подключён' : 'Сервер недоступен'}
            </p>
            <p className="text-sm text-white/70 mt-1">{API_BASE}</p>
          </div>
          <div className="w-14 h-14 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
            <div className={`w-4 h-4 rounded-full ${serverConnected ? 'bg-emerald-300 animate-pulse shadow-lg shadow-emerald-300/50' : 'bg-orange-300 shadow-lg shadow-orange-300/50'}`} />
          </div>
        </div>
      </div>

      {/* Settings sections */}
      {sections.map(section => (
        <div key={section.title}>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-1 font-semibold">{section.title}</p>
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            {section.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-4 active:bg-white/5 transition-all ${
                    idx !== section.items.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                  </div>
                  <span className="text-xs text-gray-500 font-semibold">{item.value}</span>
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </a>
              );
            })}
          </div>
        </div>
      ))}

      {/* Test notification */}
      {serverConnected && (
        <button
          onClick={handleTestNotify}
          disabled={testing}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] text-white text-sm font-bold active:bg-white/10 border border-white/10 backdrop-blur-xl disabled:opacity-50 transition-all"
        >
          <TestTube className="w-5 h-5" />
          {testing ? 'Отправка...' : 'Тестовое уведомление'}
        </button>
      )}

      {/* App info */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-6 border border-white/10 text-center">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-3 shadow-lg shadow-purple-500/30">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <p className="text-lg font-bold text-white">Видеонаблюдение</p>
        <p className="text-xs text-gray-500 mt-1">Версия 1.0.0 • PWA</p>
        <p className="text-xs text-gray-600 mt-3">
          Установите на главный экран для быстрого доступа
        </p>
      </div>

      {/* Install hint */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-5 border border-indigo-500/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-500/30">
            <Info className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-300 leading-relaxed">
              💡 <strong className="text-white">Установка:</strong> Откройте меню браузера → «Добавить на главный экран». 
              Приложение будет работать как нативное.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
