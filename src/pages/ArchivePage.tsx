import { useState, useEffect, useCallback } from 'react';
import { Archive, RefreshCw, Play, WifiOff } from 'lucide-react';
import { getArchive, recUrl, clipUrl, todayLocal, type FileInfo } from '../api';

export default function ArchivePage() {
  const [cameras, setCameras] = useState<string[]>([]);
  const [cam, setCam] = useState('');
  const [date, setDate] = useState(todayLocal);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [clips, setClips] = useState<FileInfo[]>([]);
  const [playing, setPlaying] = useState<{ kind: 'rec' | 'clip'; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getArchive(cam || undefined, date);
      setCameras(r.cameras);
      if (!cam && r.cam) setCam(r.cam);
      setFiles(r.files);
      setClips(r.clips || []);
      setError('');
    } catch (e: any) {
      setError(e.message === 'auth' ? 'Требуется вход' : 'Не удалось загрузить');
    } finally {
      setLoading(false);
    }
  }, [cam, date]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Архив</h2>
          <p className="text-sm text-gray-500 mt-0.5">{files.length} записей · {clips.length} видео событий</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={cam}
            onChange={e => setCam(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50"
          >
            {cameras.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50"
          />
          <button onClick={load} className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center gap-3">
          <WifiOff className="w-5 h-5 text-amber-400" />
          <span className="text-amber-300 text-sm">{error}</span>
        </div>
      )}

      {playing && (
        <div className="rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video">
          <video key={playing.kind + playing.name} src={playing.kind === 'clip' ? clipUrl(`${cam}/${playing.name}`) : recUrl(cam, playing.name)} controls autoPlay playsInline className="w-full h-full" />
        </div>
      )}

      {clips.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-orange-300">🎬 Видео событий</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {clips.map(f => (
              <button key={f.name} onClick={() => setPlaying({ kind: 'clip', name: f.name })}
                className={`rounded-xl border p-3 text-left transition ${playing?.kind === 'clip' && playing.name === f.name ? 'border-orange-400/60 bg-orange-500/15' : 'border-orange-500/20 bg-orange-500/[0.06] hover:border-orange-400/40'}`}>
                <div className="flex items-center gap-2"><Play className="w-3.5 h-3.5 text-orange-300 shrink-0" /><span className="text-sm font-medium truncate">{f.time}</span></div>
                <p className="text-[11px] text-gray-500 mt-1">{f.size_mb} МБ</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && !files.length && !clips.length ? (
        <div className="flex justify-center py-16"><RefreshCw className="w-8 h-8 animate-spin text-emerald-400" /></div>
      ) : files.length === 0 && clips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-700 p-12 text-center">
          <Archive className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Записей за этот день нет</p>
        </div>
      ) : files.length > 0 && (
        <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-400">Непрерывная запись</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {files.map(f => (
            <button
              key={f.name}
              onClick={() => setPlaying({ kind: 'rec', name: f.name })}
              className={`rounded-xl border p-3 text-left transition ${
                playing?.kind === 'rec' && playing.name === f.name
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-white/[0.06] bg-white/[0.03] hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium truncate">{f.time}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">{f.size_mb} МБ</p>
            </button>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}
