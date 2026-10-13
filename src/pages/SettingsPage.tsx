import { useState, useEffect } from 'react';
import { ChevronRight, Camera, Bell, Film, HardDrive, Wifi, Shield, ExternalLink, TestTube } from 'lucide-react';
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
    <div className="space-y-4 p-4">
      {/* Server status card */}
      <div className={`rounded-2xl p-4 border ${
        serverConnected 
          ? 'bg-[#21A038]/10 border-[#21A038]/20' 
          : 'bg-amber-500/10 border-amber-500/20'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-semibold ${serverConnected ? 'text-[#21A038]' : 'text-amber-400'}`}>
              {serverConnected ? 'Сервер подключён' : 'Сервер недоступен'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{API_BASE}</p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            serverConnected ? 'bg-[#21A038]/20' : 'bg-amber-500/20'
          }`}>
            <div className={`w-3 h-3 rounded-full ${serverConnected ? 'bg-[#21A038] animate-pulse' : 'bg-amber-400'}`} />
          </div>
        </div>
      </div>

      {/* Settings sections */}
      {sections.map(section => (
        <div key={section.title}>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-1">{section.title}</p>
          <div className="bg-[#1c1c1e] rounded-2xl border border-white/5 overflow-hidden">
            {section.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 active:bg-white/5 transition ${
                    idx !== section.items.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{item.label}</p>
                  </div>
                  <span className="text-xs text-gray-500">{item.value}</span>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
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
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 text-white text-sm font-medium active:bg-white/10 border border-white/5 disabled:opacity-50"
        >
          <TestTube className="w-4 h-4" />
          {testing ? 'Отправка...' : 'Тестовое уведомление'}
        </button>
      )}

      {/* App info */}
      <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/5 text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#21A038] to-[#1a8a2e] flex items-center justify-center mb-2">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-semibold text-white">СберДом</p>
        <p className="text-[10px] text-gray-500 mt-0.5">Версия 1.0.0 • PWA</p>
        <p className="text-[10px] text-gray-600 mt-2">
          Установите на главный экран для быстрого доступа
        </p>
      </div>

      {/* Install hint */}
      <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/5">
        <p className="text-xs text-gray-400 leading-relaxed">
          💡 <strong className="text-white">Установка:</strong> Откройте меню браузера → «Добавить на главный экран». 
          Приложение будет работать как нативное.
        </p>
      </div>
    </div>
  );
}
