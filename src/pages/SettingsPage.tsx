import { useState, useEffect } from 'react';
import { Settings, Camera, Bell, Film, HardDrive, Shield, Wifi, Save, TestTube, RotateCcw, ExternalLink, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import { API_BASE, checkConnection, getSettingsPageUrl, testNotification } from '../api';

export default function SettingsPage() {
  const [serverConnected, setServerConnected] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [testing, setTesting] = useState(false);

  // Settings state
  const [port, setPort] = useState('8080');
  const [segmentMinutes, setSegmentMinutes] = useState('10');
  const [keepDays, setKeepDays] = useState('14');
  const [fastDays, setFastDays] = useState('3');
  const [maxGb, setMaxGb] = useState('300');
  const [archiveDir, setArchiveDir] = useState('');
  const [motionArea, setMotionArea] = useState('0.01');
  const [motionCooldown, setMotionCooldown] = useState('30');
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [yandexToken, setYandexToken] = useState('');
  const [yandexScenarioId, setYandexScenarioId] = useState('');
  const [clipPre, setClipPre] = useState('10');
  const [clipPost, setClipPost] = useState('60');
  const [clipMax, setClipMax] = useState('180');
  const [clipSource, setClipSource] = useState('main');
  const [clipDir, setClipDir] = useState('');
  const [bufferDir, setBufferDir] = useState('');
  const [clipKeepDays, setClipKeepDays] = useState('30');
  const [publicUrl, setPublicUrl] = useState('');
  const [vkToken, setVkToken] = useState('');
  const [vkPeerId, setVkPeerId] = useState('');
  const [tailscaleIp, setTailscaleIp] = useState('');
  const [tunnel, setTunnel] = useState('tunnel@185.204.2.41');
  const [recordEnabled, setRecordEnabled] = useState(true);
  const [detectEnabled, setDetectEnabled] = useState(true);
  const [clipEnabled, setClipEnabled] = useState(true);

  useEffect(() => {
    checkConnection().then(connected => {
      setServerConnected(connected);
    });
  }, []);

  const handleSave = async () => {
    if (!serverConnected) {
      setSaveError('Сервер недоступен');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('port', port);
      formData.append('segment_minutes', segmentMinutes);
      formData.append('keep_days', keepDays);
      formData.append('fast_days', fastDays);
      formData.append('max_gb', maxGb);
      formData.append('archive_dir', archiveDir);
      formData.append('motion_area', motionArea);
      formData.append('motion_cooldown', motionCooldown);
      formData.append('telegram_token', telegramToken);
      formData.append('telegram_chat_id', telegramChatId);
      formData.append('yandex_token', yandexToken);
      formData.append('yandex_scenario_id', yandexScenarioId);
      formData.append('clip_pre', clipPre);
      formData.append('clip_post', clipPost);
      formData.append('clip_max', clipMax);
      formData.append('clip_source', clipSource);
      formData.append('clip_dir', clipDir);
      formData.append('buffer_dir', bufferDir);
      formData.append('clip_keep_days', clipKeepDays);
      formData.append('public_url', publicUrl);
      formData.append('vk_token', vkToken);
      formData.append('vk_peer_id', vkPeerId);
      formData.append('tailscale_ip', tailscaleIp);
      formData.append('tunnel', tunnel);
      if (recordEnabled) formData.append('record_enabled', 'on');
      if (detectEnabled) formData.append('detect_enabled', 'on');
      if (clipEnabled) formData.append('clip_enabled', 'on');

      const response = await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        setSaved(true);
        setSaveError('');
        setTimeout(() => setSaved(false), 3000);
      } else {
        setSaveError('Ошибка сохранения');
      }
    } catch (err) {
      setSaveError('Ошибка соединения с сервером');
    }
  };

  const handleTestNotify = async () => {
    setTesting(true);
    try {
      await testNotification();
    } catch {
      // ignore
    }
    setTesting(false);
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
      {/* Server status */}
      {serverConnected === false && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-amber-400" />
            <div className="flex-1">
              <p className="text-xs text-amber-400">
                Сервер недоступен — изменения не будут сохранены. Запустите cctv_server.py на порту 8080.
              </p>
            </div>
            <a
              href={API_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/30 transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3 h-3" /> Открыть сервер
            </a>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Настройки</h2>
          <p className="text-sm text-gray-500 mt-1">Конфигурация системы видеонаблюдения</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Сохранено на сервере
            </span>
          )}
          {saveError && (
            <span className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {saveError}
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition"
          >
            <Save className="w-4 h-4" /> Сохранить на сервер
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

      {/* Link to server settings page */}
      {serverConnected && (
        <a
          href={getSettingsPageUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition"
        >
          <ExternalLink className="w-3 h-3" />
          Открыть полную страницу настроек на сервере
        </a>
      )}

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
                  value={port}
                  onChange={e => setPort(e.target.value)}
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
                <p className="text-[10px] text-gray-600 mt-1">Нужен перезапуск программы</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Пауза между событиями, сек</label>
                <input
                  type="number"
                  value={motionCooldown}
                  onChange={e => setMotionCooldown(e.target.value)}
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Мин. размер объекта (доля кадра)</label>
                <input
                  type="number"
                  step="0.01"
                  value={motionArea}
                  onChange={e => setMotionArea(e.target.value)}
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
                <p className="text-[10px] text-gray-600 mt-1">0.01 = 1%, больше = менее чувствительно</p>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recordEnabled}
                  onChange={e => setRecordEnabled(e.target.checked)}
                />
                <div>
                  <span className="text-sm text-gray-300">Запись включена</span>
                  <p className="text-[10px] text-gray-600">Непрерывная запись со всех камер</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={detectEnabled}
                  onChange={e => setDetectEnabled(e.target.checked)}
                />
                <div>
                  <span className="text-sm text-gray-300">Детекция движения и уведомления</span>
                  <p className="text-[10px] text-gray-600">Распознавание людей, машин, животных</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={clipEnabled}
                  onChange={e => setClipEnabled(e.target.checked)}
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
              </div>
            </div>
            <button
              onClick={async () => {
                if (!serverConnected) return;
                // Здесь можно добавить реальную отправку
                alert('Добавление камеры через сервер: ' + API_BASE + '/add');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition"
            >
              Добавить камеру
            </button>
          </div>
          <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5">
            <h3 className="text-sm font-medium mb-4">Управление камерами на сервере</h3>
            {serverConnected ? (
              <a
                href={getSettingsPageUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition border border-cyan-500/20 w-fit"
              >
                <ExternalLink className="w-4 h-4" /> Открыть управление камерами
              </a>
            ) : (
              <p className="text-xs text-gray-500">Запустите сервер для управления камерами</p>
            )}
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5 space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <span className="text-blue-400 font-bold text-sm">✈️</span> Telegram
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Токен бота</label>
                <input
                  type="password"
                  value={telegramToken}
                  onChange={e => setTelegramToken(e.target.value)}
                  placeholder="123456:ABC-DEF..."
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Chat ID</label>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={e => setTelegramChatId(e.target.value)}
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
                  value={vkToken}
                  onChange={e => setVkToken(e.target.value)}
                  placeholder="Ключ доступа"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">ID или короткое имя страницы</label>
                <input
                  type="text"
                  value={vkPeerId}
                  onChange={e => setVkPeerId(e.target.value)}
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
                  value={yandexToken}
                  onChange={e => setYandexToken(e.target.value)}
                  placeholder="OAuth-токен"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">ID сценария</label>
                <input
                  type="text"
                  value={yandexScenarioId}
                  onChange={e => setYandexScenarioId(e.target.value)}
                  placeholder="ID сценария"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleTestNotify}
            disabled={testing || !serverConnected}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition border border-blue-500/20 disabled:opacity-50"
          >
            <TestTube className="w-4 h-4" /> {testing ? 'Отправка...' : 'Отправить тестовое уведомление'}
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
              <input type="number" value={clipPre} onChange={e => setClipPre(e.target.value)} className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Секунд ПОСЛЕ срабатывания</label>
              <input type="number" value={clipPost} onChange={e => setClipPost(e.target.value)} className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Максимальная длина, сек</label>
              <input type="number" value={clipMax} onChange={e => setClipMax(e.target.value)} className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Качество видео события</label>
              <select value={clipSource} onChange={e => setClipSource(e.target.value)} className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50">
                <option value="main">Основной поток (main)</option>
                <option value="sub">Лёгкий подпоток (sub)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Папка для видео событий</label>
              <input type="text" value={clipDir} onChange={e => setClipDir(e.target.value)} placeholder="Пусто = clips" className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Папка буфера</label>
              <input type="text" value={bufferDir} onChange={e => setBufferDir(e.target.value)} placeholder="Пусто = buffer" className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Хранить видео событий, дней</label>
              <input type="number" value={clipKeepDays} onChange={e => setClipKeepDays(e.target.value)} className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
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
              <input type="number" value={segmentMinutes} onChange={e => setSegmentMinutes(e.target.value)} className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Хранить записи, дней</label>
              <input type="number" value={keepDays} onChange={e => setKeepDays(e.target.value)} className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Дней на основном диске до переноса</label>
              <input type="number" value={fastDays} onChange={e => setFastDays(e.target.value)} className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Максимум места под записи, ГБ</label>
              <input type="number" value={maxGb} onChange={e => setMaxGb(e.target.value)} className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Папка архива (второй диск)</label>
              <input type="text" value={archiveDir} onChange={e => setArchiveDir(e.target.value)} placeholder="Пусто = не использовать" className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
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
              <input type="text" value={publicUrl} onChange={e => setPublicUrl(e.target.value)} placeholder="https://..." className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">SSH-туннель</label>
              <input type="text" value={tunnel} onChange={e => setTunnel(e.target.value)} placeholder="пользователь@сервер" className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Доп. адрес для WebRTC (Tailscale VPN)</label>
              <input type="text" value={tailscaleIp} onChange={e => setTailscaleIp(e.target.value)} placeholder="100.x.y.z" className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
