import { useState, useEffect, useCallback } from 'react';
import { Camera, Wifi, WifiOff, Play, Maximize2, RefreshCw, Circle } from 'lucide-react';
import { getStatus, frameUrl, hlsPlayerUrl } from '../api';

interface Cam {
  name: string;
  online: boolean;
  recording: boolean;
  detecting: boolean;
  record: boolean;
  detect: boolean;
  has_sub: boolean;
  url_masked: string;
}

export default function CamerasPage() {
  const [cameras, setCameras] = useState<Cam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [playing, setPlaying] = useState<Record<string, boolean>>({});
  const [hd, setHd] = useState<Record<string, boolean>>({});   // HD = основной поток, иначе лёгкий подпоток (если задан)
  const [tick, setTick] = useState(0);                          // обновление снимков в сетке
  const [stats, setStats] = useState({ used: 0, free: 0, files: 0, mtx: false, tunnel_up: false });

  const load = useCallback(async () => {
    try {
      const s = await getStatus();
      setCameras(s.cameras);
      setStats({ used: s.disk_used_gb, free: s.disk_free_gb, files: s.disk_files, mtx: s.mtx, tunnel_up: s.tunnel_up });
      setError('');
      setTick(t => t + 1);
    } catch (e: any) {
      setError(e.message === 'auth' ? 'Требуется вход' : 'Сервер недоступен');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [load]);

  const online = cameras.filter(c => c.online).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <WifiOff className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <p className="text-amber-300 font-medium">{error}</p>
        <button onClick={load} className="mt-4 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 text-sm hover:bg-amber-500/30">
          Повторить
        </button>
      </div>
    );
  }

  if (selected) {
    const cam = cameras.find(c => c.name === selected);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelected(null)} className="text-sm text-gray-400 hover:text-white">← Все камеры</button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${cam?.online ? 'bg-emerald-400' : 'bg-red-400'}`} />
            {selected}
          </h2>
          {cam?.has_sub ? (
            <button onClick={() => setHd(h => ({ ...h, [selected]: !h[selected] }))}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-xs font-medium text-gray-200 hover:bg-white/10">
              {hd[selected] ? 'HD · переключить на SD' : 'SD · переключить на HD'}
            </button>
          ) : <div className="w-20" />}
        </div>
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-gray-800">
          <iframe
            key={selected + (hd[selected] ? ':hd' : ':sd')}
            src={hlsPlayerUrl(selected, !!cam?.has_sub && !hd[selected])}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            title={selected}
          />
        </div>
        <div className="flex gap-3 text-sm text-gray-400">
          {cam?.recording && <span className="flex items-center gap-1"><Circle className="w-3 h-3 fill-red-500 text-red-500" /> Запись</span>}
          {cam?.detecting && <span className="text-purple-400">Детекция</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Камеры</h2>
          <p className="text-sm text-gray-500 mt-0.5">{online} из {cameras.length} в сети</p>
        </div>
        <button onClick={load} className="self-start p-2 rounded-lg hover:bg-white/5 text-gray-400">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Камер', value: cameras.length, color: 'text-white' },
          { label: 'В сети', value: online, color: 'text-emerald-400' },
          { label: 'Запись', value: cameras.filter(c => c.recording).length, color: 'text-cyan-400' },
          { label: 'Диск', value: `${stats.used.toFixed(1)} ГБ`, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
            <p className="text-[11px] uppercase tracking-wider text-gray-500">{s.label}</p>
            <p className={`text-xl font-semibold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {cameras.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-700 p-12 text-center">
          <Camera className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Камер пока нет</p>
          <p className="text-sm text-gray-600 mt-1">Добавьте в разделе «Настройки»</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {cameras.map(cam => (
            <div
              key={cam.name}
              className="group rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden hover:border-emerald-500/30 transition-all"
            >
              <div
                className="relative aspect-video bg-black cursor-pointer"
                onClick={() => setSelected(cam.name)}
              >
                {playing[cam.name] ? (
                  <iframe src={hlsPlayerUrl(cam.name, cam.has_sub)} className="w-full h-full" allow="autoplay" title={cam.name} />
                ) : (
                  <>
                    <img
                      src={frameUrl(cam.name, tick)}
                      alt={cam.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      onLoad={e => { (e.target as HTMLImageElement).style.display = ''; }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition">
                      <button
                        onClick={e => { e.stopPropagation(); setPlaying(p => ({ ...p, [cam.name]: true })); }}
                        className="w-14 h-14 rounded-full bg-emerald-500/90 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 transition"
                      >
                        <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                      </button>
                    </div>
                  </>
                )}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${cam.online ? 'bg-emerald-400 shadow shadow-emerald-400/50' : 'bg-red-400'}`} />
                  {cam.recording && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/80 text-white">REC</span>}
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setSelected(cam.name); }}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/50 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{cam.name}</h3>
                  <div className="flex items-center gap-2 text-[11px]">
                    {cam.detecting ? (
                      <span className="text-purple-400">AI</span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                    {cam.online ? (
                      <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <WifiOff className="w-3.5 h-3.5 text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
