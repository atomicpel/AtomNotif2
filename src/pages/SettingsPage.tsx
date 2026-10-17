import { useState, useEffect, useCallback } from 'react';
import { Settings, RefreshCw, Save, Bell, WifiOff, Plus, Trash2, Camera } from 'lucide-react';
import { getConfig, saveSettings, testNotify, addCamera, deleteCamera, editCamera } from '../api';

export default function SettingsPage() {
  const [cfg, setCfg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState<'general' | 'cameras' | 'notify'>('general');

  // new camera form
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newSub, setNewSub] = useState('');
  const [subEdit, setSubEdit] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const c = await getConfig();
      setCfg(c);
      setError('');
    } catch (e: any) {
      setError(e.message === 'forbidden' ? 'Только администратор' : e.message === 'auth' ? 'Требуется вход' : 'Ошибка');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // обновляет только список камер/пользователей, не трогая несохранённые правки в остальных полях
  const refreshCams = async () => {
    try { const c = await getConfig(); setCfg((prev: any) => ({ ...prev, cameras: c.cameras, users: c.users })); } catch { /* ignore */ }
  };

  const set = (k: string, v: any) => setCfg((c: any) => ({ ...c, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try {
      await saveSettings(cfg);
      setMsg('Сохранено');
      setTimeout(() => setMsg(''), 2500);
    } catch {
      setMsg('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    try { await testNotify(); setMsg('Тест отправлен'); }
    catch { setMsg('Ошибка теста'); }
  };

  const handleAddCam = async () => {
    try {
      const r = await addCamera(newName, newUrl, newSub);
      if (r.ok) { setNewName(''); setNewUrl(''); setNewSub(''); refreshCams(); }
      else setMsg('Не удалось добавить камеру');
    } catch { setMsg('Ошибка'); }
  };

  const handleDelCam = async (name: string) => {
    if (!confirm(`Удалить камеру ${name}?`)) return;
    await deleteCamera(name);
    load();
  };

  const toggleCam = async (name: string, field: 'record' | 'detect', val: boolean) => {
    await editCamera(name, { [field]: val });
    refreshCams();
  };

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-emerald-400" /></div>;
  if (error) return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
      <WifiOff className="w-10 h-10 text-amber-400 mx-auto mb-3" />
      <p className="text-amber-300">{error}</p>
    </div>
  );
  if (!cfg) return null;

  const inputCls = 'w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50';
  const labelCls = 'block text-xs text-gray-500 mb-1';

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Настройки</h2>
          <p className="text-sm text-gray-500 mt-0.5">Сервер и камеры</p>
        </div>
        {msg && <span className="text-sm text-emerald-400">{msg}</span>}
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
        {([
          ['general', 'Общие'],
          ['cameras', 'Камеры'],
          ['notify', 'Уведомления'],
        ] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === k ? 'bg-emerald-500/15 text-emerald-300' : 'text-gray-400 hover:text-gray-200'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-4">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!cfg.record_enabled} onChange={e => set('record_enabled', e.target.checked)} className="accent-emerald-500" />
                Запись
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!cfg.detect_enabled} onChange={e => set('detect_enabled', e.target.checked)} className="accent-emerald-500" />
                Детекция
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!cfg.clip_enabled} onChange={e => set('clip_enabled', e.target.checked)} className="accent-emerald-500" />
                Видео событий
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Длина файла записи, мин</label>
                <input type="number" value={cfg.segment_minutes ?? 10} onChange={e => set('segment_minutes', +e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Хранить записи, дней</label>
                <input type="number" value={cfg.keep_days ?? 14} onChange={e => set('keep_days', +e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Дней на основном диске</label>
                <input type="number" value={cfg.fast_days ?? 3} onChange={e => set('fast_days', +e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Макс. место, ГБ</label>
                <input type="number" value={cfg.max_gb ?? 300} onChange={e => set('max_gb', +e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Папка архива (второй диск)</label>
                <input value={cfg.archive_dir ?? ''} onChange={e => set('archive_dir', e.target.value)} className={inputCls} placeholder="пусто = не использовать" />
              </div>
              <div>
                <label className={labelCls}>Чувствительность движения (0.01 = 1%)</label>
                <input type="number" step="0.001" value={cfg.motion_area ?? 0.01} onChange={e => set('motion_area', +e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Пауза между событиями, сек</label>
                <input type="number" value={cfg.motion_cooldown ?? 30} onChange={e => set('motion_cooldown', +e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>SSH-туннель (user@server)</label>
                <input value={cfg.tunnel ?? ''} onChange={e => set('tunnel', e.target.value)} className={inputCls} placeholder="tunnel@185.204.2.41" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Публичный URL (для ссылок в уведомлениях)</label>
                <input value={cfg.public_url ?? ''} onChange={e => set('public_url', e.target.value)} className={inputCls} placeholder="https://camera.example.com" />
              </div>
              <div>
                <label className={labelCls}>Видео события: секунд ДО срабатывания</label>
                <input type="number" value={cfg.clip_pre ?? 10} onChange={e => set('clip_pre', +e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Видео события: секунд ПОСЛЕ срабатывания</label>
                <input type="number" value={cfg.clip_post ?? 60} onChange={e => set('clip_post', +e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Качество видео события</label>
                <select value={cfg.clip_source ?? 'main'} onChange={e => set('clip_source', e.target.value)} className={inputCls}>
                  <option value="main">Основной поток (чётче, больше места)</option>
                  <option value="sub">Подпоток (легче)</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Фото события: секунд на выбор лучшего кадра</label>
                <input type="number" step="0.5" value={cfg.snap_window ?? 2} onChange={e => set('snap_window', +e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Видео в браузере</label>
                <select value={cfg.hls_mode ?? 'low'} onChange={e => set('hls_mode', e.target.value)} className={inputCls}>
                  <option value="low">Малая задержка (1–3 с)</option>
                  <option value="stable">Устойчивее при слабой сети (задержка больше)</option>
                </select>
              </div>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-400 disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Сохранение…' : 'Сохранить'}
          </button>
        </div>
      )}

      {tab === 'cameras' && (
        <div className="space-y-4">
          {(cfg.cameras || []).map((c: any) => (
            <div key={c.name} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium flex items-center gap-2"><Camera className="w-4 h-4 text-emerald-400" /> {c.name}</p>
                  <p className="text-xs text-gray-500 mt-1 break-all">{c.url}</p>
                </div>
                <button onClick={() => handleDelCam(c.name)} className="p-2 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-4 mt-3 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!c.record} onChange={e => toggleCam(c.name, 'record', e.target.checked)} className="accent-emerald-500" />
                  Запись
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!c.detect} onChange={e => toggleCam(c.name, 'detect', e.target.checked)} className="accent-emerald-500" />
                  Детекция
                </label>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <a href={`/zones/${encodeURIComponent(c.name)}`} target="_blank" rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-200 hover:bg-white/10">Зоны игнорирования</a>
                <span className="text-gray-500 break-all">Подпоток: {c.detect_url || 'не задан'}</span>
              </div>
              <div className="mt-2 flex gap-2">
                <input value={subEdit[c.name] ?? ''} onChange={e => setSubEdit(s => ({ ...s, [c.name]: e.target.value }))}
                  placeholder="Ссылка на подпоток rtsp://… (пусто = убрать)" className={inputCls} />
                <button onClick={async () => { await editCamera(c.name, { detect_url: subEdit[c.name] ?? '' }); setSubEdit(s => ({ ...s, [c.name]: '' })); refreshCams(); }}
                  className="px-3 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-medium hover:bg-emerald-500/25 whitespace-nowrap">Сохранить</button>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-dashed border-gray-700 p-4 space-y-3">
            <p className="text-sm font-medium text-gray-300 flex items-center gap-2"><Plus className="w-4 h-4" /> Добавить камеру</p>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Имя (латиницей)" className={inputCls} />
            <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="rtsp://user:pass@ip:554/stream1" className={inputCls} />
            <input value={newSub} onChange={e => setNewSub(e.target.value)} placeholder="Подпоток (необязательно)" className={inputCls} />
            <button onClick={handleAddCam} className="px-4 py-2 rounded-lg bg-emerald-500/15 text-emerald-300 text-sm font-medium hover:bg-emerald-500/25">
              Добавить
            </button>
          </div>
        </div>
      )}

      {tab === 'notify' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
            <p className="text-sm font-medium text-gray-300">Тихие часы</p>
            <p className="text-xs text-gray-500">В этот промежуток Telegram, VK, Макс и Алиса не получают оповещения. События и запись продолжаются. Через полночь можно: с 23:00 до 07:00.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Не беспокоить с (ЧЧ:ММ)</label>
                <input value={cfg.notify_quiet_start ?? ''} onChange={e => set('notify_quiet_start', e.target.value)} className={inputCls} placeholder="23:00" />
              </div>
              <div>
                <label className={labelCls}>до (ЧЧ:ММ)</label>
                <input value={cfg.notify_quiet_end ?? ''} onChange={e => set('notify_quiet_end', e.target.value)} className={inputCls} placeholder="07:00" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
            <p className="text-sm font-medium text-gray-300">Telegram</p>
            <div>
              <label className={labelCls}>Токен бота</label>
              <input value={cfg.telegram_token ?? ''} onChange={e => set('telegram_token', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Chat ID</label>
              <input value={cfg.telegram_chat_id ?? ''} onChange={e => set('telegram_chat_id', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
            <p className="text-sm font-medium text-gray-300">ВКонтакте</p>
            <div>
              <label className={labelCls}>Ключ сообщества</label>
              <input value={cfg.vk_token ?? ''} onChange={e => set('vk_token', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>ID или короткое имя</label>
              <input value={cfg.vk_peer_id ?? ''} onChange={e => set('vk_peer_id', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
            <p className="text-sm font-medium text-gray-300">Макс</p>
            <div>
              <label className={labelCls}>Токен бота</label>
              <input value={cfg.max_token ?? ''} onChange={e => set('max_token', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>ID чата или канала</label>
              <input value={cfg.max_chat_id ?? ''} onChange={e => set('max_chat_id', e.target.value)} className={inputCls} placeholder="число (у канала может быть со знаком минус)" />
            </div>
            <div>
              <label className={labelCls}>Файл сертификата Минцифры (PEM)</label>
              <input value={cfg.ssl_ca_file ?? ''} onChange={e => set('ssl_ca_file', e.target.value)} className={inputCls} placeholder="C:\cctv\russian_ca.pem — нужен, если Макс не отвечает из-за сертификата" />
            </div>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
            <p className="text-sm font-medium text-gray-300">Алиса (Яндекс)</p>
            <div>
              <label className={labelCls}>OAuth-токен</label>
              <input value={cfg.yandex_token ?? ''} onChange={e => set('yandex_token', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>ID сценария</label>
              <input value={cfg.yandex_scenario_id ?? ''} onChange={e => set('yandex_scenario_id', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-400 disabled:opacity-50">
              <Save className="w-4 h-4" /> Сохранить
            </button>
            <button onClick={handleTest}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-gray-200 text-sm font-medium hover:bg-white/10">
              <Bell className="w-4 h-4" /> Тест уведомления
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
