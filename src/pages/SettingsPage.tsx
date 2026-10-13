import { useState } from 'react';
import { Settings, Camera, Bell, Film, HardDrive, Shield, Wifi, Save, TestTube, RotateCcw } from 'lucide-react';

interface SettingsData {
  port: string;
  segmentMinutes: string;
  keepDays: string;
  fastDays: string;
  maxGb: string;
  archiveDir: string;
  motionArea: string;
  motionCooldown: string;
  telegramToken: string;
  telegramChatId: string;
  yandexToken: string;
  yandexScenarioId: string;
  clipPre: string;
  clipPost: string;
  clipMax: string;
  clipSource: string;
  clipDir: string;
  bufferDir: string;
  clipKeepDays: string;
  publicUrl: string;
  vkToken: string;
  vkPeerId: string;
  tailscaleIp: string;
  tunnel: string;
  recordEnabled: boolean;
  detectEnabled: boolean;
  clipEnabled: boolean;
}

const defaultSettings: SettingsData = {
  port: '8080',
  segmentMinutes: '10',
  keepDays: '14',
  fastDays: '3',
  maxGb: '300',
  archiveDir: '',
  motionArea: '0.01',
  motionCooldown: '30',
  telegramToken: '',
  telegramChatId: '',
  yandexToken: '',
  yandexScenarioId: '',
  clipPre: '10',
  clipPost: '60',
  clipMax: '180',
  clipSource: 'main',
  clipDir: '',
  bufferDir: '',
  clipKeepDays: '30',
  publicUrl: '',
  vkToken: '',
  vkPeerId: '',
  tailscaleIp: '',
  tunnel: 'tunnel@185.204.2.41',
  recordEnabled: true,
  detectEnabled: true,
  clipEnabled: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const update = (key: keyof SettingsData, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { key: 'general', label: 'Общие', icon: Settings },
    { key: 'cameras', label: 'Камеры', icon: Camera },
    { key: 'notifications', label: 'Уведомления', icon: Bell },
    { key: 'clips', label: 'Видео событий', icon: Film },
    { key: 'storage', label: 'Хранилище', icon: HardDrive },
    { key: 'network', label: 'Сеть', icon: Wifi },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Настройки</h2>
          <p className="text-sm text-gray-500 mt-1">Конфигурация системы видеонаблюдения</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-emerald-400 animate-pulse">✓ Сохранено</span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition"
          >
            <Save className="w-4 h-4" /> Сохранить
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              activeTab === key
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-[#161b22] text-gray-500 border border-gray-800 hover:border-gray-700 hover:text-gray-300'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5 space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-500" /> Основные параметры
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Порт сайта</label>
                <input
                  type="number"
                  value={settings.port}
                  onChange={e => update('port', e.target.value)}
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
                <p className="text-[10px] text-gray-600 mt-1">Нужен перезапуск программы</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Пауза между событиями, сек</label>
                <input
                  type="number"
                  value={settings.motionCooldown}
                  onChange={e => update('motionCooldown', e.target.value)}
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Мин. размер объекта (доля кадра)</label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.motionArea}
                  onChange={e => update('motionArea', e.target.value)}
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
                <p className="text-[10px] text-gray-600 mt-1">0.01 = 1%, больше = менее чувствительно</p>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.recordEnabled}
                  onChange={e => update('recordEnabled', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-700 bg-[#0d1117] text-emerald-500 focus:ring-emerald-500/20"
                />
                <div>
                  <span className="text-sm text-gray-300">Запись включена</span>
                  <p className="text-[10px] text-gray-600">Непрерывная запись со всех камер</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.detectEnabled}
                  onChange={e => update('detectEnabled', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-700 bg-[#0d1117] text-emerald-500 focus:ring-emerald-500/20"
                />
                <div>
                  <span className="text-sm text-gray-300">Детекция движения и уведомления</span>
                  <p className="text-[10px] text-gray-600">Распознавание людей, машин, животных</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.clipEnabled}
                  onChange={e => update('clipEnabled', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-700 bg-[#0d1117] text-emerald-500 focus:ring-emerald-500/20"
                />
                <div>
                  <span className="text-sm text-gray-300">Видео событий</span>
                  <p className="text-[10px] text-gray-600">Запись клипов до и после срабатывания</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Cameras */}
      {activeTab === 'cameras' && (
        <div className="space-y-4">
          <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Camera className="w-4 h-4 text-gray-500" /> Добавить камеру
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Имя (латиницей)</label>
                <input
                  type="text"
                  placeholder="например: entrance"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">RTSP-ссылка</label>
                <input
                  type="text"
                  placeholder="rtsp://логин:пароль@192.168.1.10:554/stream1"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">Подпоток для детекции (необязательно)</label>
                <input
                  type="text"
                  placeholder="rtsp://логин:пароль@192.168.1.10:554/stream2"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
                <p className="text-[10px] text-gray-600 mt-1">Лёгкий поток для детекции и просмотра с телефона</p>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition">
              Добавить камеру
            </button>
          </div>
          <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5">
            <h3 className="text-sm font-medium mb-4">Поиск камер в сети (ONVIF)</h3>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition border border-cyan-500/20">
              <RotateCcw className="w-4 h-4" /> Сканировать сеть
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5 space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
              Telegram
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Токен бота</label>
                <input
                  type="password"
                  value={settings.telegramToken}
                  onChange={e => update('telegramToken', e.target.value)}
                  placeholder="123456:ABC-DEF..."
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Chat ID</label>
                <input
                  type="text"
                  value={settings.telegramChatId}
                  onChange={e => update('telegramChatId', e.target.value)}
                  placeholder="-1001234567890"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5 space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <span className="text-blue-500 font-bold text-sm">VK</span> ВКонтакте
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Ключ доступа сообщества</label>
                <input
                  type="password"
                  value={settings.vkToken}
                  onChange={e => update('vkToken', e.target.value)}
                  placeholder="Ключ доступа"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">ID или короткое имя страницы</label>
                <input
                  type="text"
                  value={settings.vkPeerId}
                  onChange={e => update('vkPeerId', e.target.value)}
                  placeholder="ivan_petrov"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5 space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <span className="text-purple-400 font-bold text-sm">🎤</span> Алиса (Яндекс)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">OAuth-токен</label>
                <input
                  type="password"
                  value={settings.yandexToken}
                  onChange={e => update('yandexToken', e.target.value)}
                  placeholder="OAuth-токен"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">ID сценария</label>
                <input
                  type="text"
                  value={settings.yandexScenarioId}
                  onChange={e => update('yandexScenarioId', e.target.value)}
                  placeholder="ID сценария"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition border border-blue-500/20">
            <TestTube className="w-4 h-4" /> Отправить тестовое уведомление
          </button>
        </div>
      )}

      {/* Clips */}
      {activeTab === 'clips' && (
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Film className="w-4 h-4 text-gray-500" /> Видео событий
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Секунд ДО срабатывания</label>
              <input
                type="number"
                value={settings.clipPre}
                onChange={e => update('clipPre', e.target.value)}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Секунд ПОСЛЕ срабатывания</label>
              <input
                type="number"
                value={settings.clipPost}
                onChange={e => update('clipPost', e.target.value)}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Максимальная длина, сек</label>
              <input
                type="number"
                value={settings.clipMax}
                onChange={e => update('clipMax', e.target.value)}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Качество видео события</label>
              <select
                value={settings.clipSource}
                onChange={e => update('clipSource', e.target.value)}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="main">Основной поток (main)</option>
                <option value="sub">Лёгкий подпоток (sub)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Папка для видео событий</label>
              <input
                type="text"
                value={settings.clipDir}
                onChange={e => update('clipDir', e.target.value)}
                placeholder="Пусто = clips рядом с программой"
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Папка буфера</label>
              <input
                type="text"
                value={settings.bufferDir}
                onChange={e => update('bufferDir', e.target.value)}
                placeholder="Пусто = buffer (можно RAM-диск)"
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Хранить видео событий, дней</label>
              <input
                type="number"
                value={settings.clipKeepDays}
                onChange={e => update('clipKeepDays', e.target.value)}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Storage */}
      {activeTab === 'storage' && (
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-gray-500" /> Хранилище записей
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Длина одного файла записи, мин</label>
              <input
                type="number"
                value={settings.segmentMinutes}
                onChange={e => update('segmentMinutes', e.target.value)}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Хранить записи, дней</label>
              <input
                type="number"
                value={settings.keepDays}
                onChange={e => update('keepDays', e.target.value)}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Дней на основном диске до переноса</label>
              <input
                type="number"
                value={settings.fastDays}
                onChange={e => update('fastDays', e.target.value)}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Максимум места под записи, ГБ</label>
              <input
                type="number"
                value={settings.maxGb}
                onChange={e => update('maxGb', e.target.value)}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Папка архива (второй диск)</label>
              <input
                type="text"
                value={settings.archiveDir}
                onChange={e => update('archiveDir', e.target.value)}
                placeholder="Пусто = не использовать"
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
              <p className="text-[10px] text-gray-600 mt-1">Старые записи переносятся сюда с основного диска</p>
            </div>
          </div>
        </div>
      )}

      {/* Network */}
      {activeTab === 'network' && (
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Wifi className="w-4 h-4 text-gray-500" /> Сеть и удалённый доступ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Адрес сайта для ссылок в уведомлениях</label>
              <input
                type="text"
                value={settings.publicUrl}
                onChange={e => update('publicUrl', e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">SSH-туннель</label>
              <input
                type="text"
                value={settings.tunnel}
                onChange={e => update('tunnel', e.target.value)}
                placeholder="пользователь@сервер (пусто = выключен)"
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Доп. адрес для WebRTC (Tailscale VPN)</label>
              <input
                type="text"
                value={settings.tailscaleIp}
                onChange={e => update('tailscaleIp', e.target.value)}
                placeholder="100.x.y.z (необязательно)"
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
