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
        { icon: Camera, label: 'Камеры', value: '6', href: getSettingsPageUrl() },
      ]
    },
    {
      title: 'Уведомления',
      items: [
        { icon: Bell, label: 'Telegram', value: serverConnected ? '✓' : '—', href: getSettingsPageUrl() },
        { icon: Bell, label: 'ВКонтакте', value: serverConnected ? '✓' : '—', href: getSettingsPageUrl() },
        { icon: Bell, label: 'Алиса', value: serverConnected ? '✓' : '—', href: getSettingsPageUrl() },
      ]
    },
    {
      title: 'Запись',
      items: [
        { icon: Film, label: 'Видео событий', value: 'Вкл', href: getSettingsPageUrl() },
        { icon: HardDrive, label: 'Хранилище', value: '142 ГБ', href: getSettingsPageUrl() },
      ]
    },
    {
      title: 'Сеть',
      items: [
        { icon: Wifi, label: 'SSH-туннель', value: '✓', href: getSettingsPageUrl() },
        { icon: Wifi, label: 'Tailscale', value: '—', href: getSettingsPageUrl() },
      ]
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Server status */}
      <div className={`rounded-xl p-3 lg:p-4 border ${
        serverConnected 
          ? 'bg-emerald-500/10 border-emerald-500/20' 
          : 'bg-orange-500/10 border-orange-500/20'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs lg:text-sm font-semibold ${serverConnected ? 'text-emerald-400' : 'text-orange-400'}`}>
              {serverConnected ? 'Сервер подключён' : 'Сервер недоступен'}
            </p>
            <p className="text-[10px] lg:text-xs text-gray-500 mt-0.5">{API_BASE}</p>
          </div>
          <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center ${
            serverConnected ? 'bg-emerald-500/20' : 'bg-orange-500/20'
          }`}>
            <div className={`w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full ${serverConnected ? 'bg-emerald-400 animate-pulse' : 'bg-orange-400'}`} />
          </div>
        </div>
      </div>

      {/* Settings sections */}
      {sections.map(section => (
        <div key={section.title}>
          <p className="text-[10px] lg:text-xs text-gray-500 mb-2 px-1 font-medium">{section.title}</p>
          <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
            {section.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 lg:p-4 active:bg-white/5 hover:bg-white/5 transition ${
                    idx !== section.items.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs lg:text-sm font-medium text-white">{item.label}</p>
                  </div>
                  <span className="text-[10px] lg:text-xs text-gray-500 font-medium">{item.value}</span>
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
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
          className="w-full flex items-center justify-center gap-1.5 py-2.5 lg:py-3 rounded-xl bg-white/5 text-white text-xs lg:text-sm font-medium active:bg-white/10 border border-white/5 disabled:opacity-50"
        >
          <TestTube className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          {testing ? 'Отправка...' : 'Тестовое уведомление'}
        </button>
      )}

      {/* App info */}
      <div className="bg-white/5 rounded-xl p-4 lg:p-5 border border-white/5 text-center">
        <div className="w-12 h-12 lg:w-14 lg:h-14 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-2">
          <Shield className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
        </div>
        <p className="text-xs lg:text-sm font-semibold text-white">Видеонаблюдение</p>
        <p className="text-[10px] lg:text-xs text-gray-500 mt-0.5">Версия 1.0.0 • PWA</p>
      </div>

      {/* Install hint */}
      <div className="bg-indigo-500/10 rounded-xl p-3 lg:p-4 border border-indigo-500/20">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] lg:text-xs text-gray-300 leading-relaxed">
            <strong className="text-white">Установка:</strong> Меню браузера → «Добавить на главный экран»
          </p>
        </div>
      </div>
    </div>
  );
}
