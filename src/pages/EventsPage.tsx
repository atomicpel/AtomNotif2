import { useState, useEffect, useCallback } from 'react';
import { Bell, RefreshCw, User, Car, PawPrint, Film, Play, WifiOff } from 'lucide-react';
import { getEvents, snapUrl, clipUrl, recUrl, todayLocal } from '../api';

const labelIcon = (l: string) => {
  if (l.includes('человек')) return <User className="w-3.5 h-3.5" />;
  if (l.includes('машин')) return <Car className="w-3.5 h-3.5" />;
  if (l.includes('животн')) return <PawPrint className="w-3.5 h-3.5" />;
  return <Bell className="w-3.5 h-3.5" />;
};

export default function EventsPage() {
  const [date, setDate] = useState(todayLocal);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getEvents(date);
      setEvents(r.events);
      setError('');
    } catch (e: any) {
      setError(e.message === 'auth' ? 'Требуется вход' : 'Не удалось загрузить');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">События</h2>
          <p className="text-sm text-gray-500 mt-0.5">{events.length} за выбранный день</p>
        </div>
        <div className="flex items-center gap-2">
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

      {loading && !events.length ? (
        <div className="flex justify-center py-16"><RefreshCw className="w-8 h-8 animate-spin text-emerald-400" /></div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-700 p-12 text-center">
          <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Событий нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((ev, i) => (
            <div key={`${ev.ts}-${i}`} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden hover:border-white/10 transition">
              <div className="flex flex-col sm:flex-row">
                {ev.img && (
                  <div className="sm:w-48 shrink-0 aspect-video sm:aspect-auto bg-black">
                    <img src={snapUrl(ev.img)} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{ev.cam}</span>
                      <span className="text-gray-500 text-sm">{ev.time}</span>
                      {(ev.labels?.length ? ev.labels : ['движение']).map((l: string) => (
                        <span key={l} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-300">
                          {labelIcon(l)} {l}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ev.clip && (
                      <a href={clipUrl(ev.clip)} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-medium hover:bg-emerald-500/25">
                        <Film className="w-3.5 h-3.5" /> Видео события
                      </a>
                    )}
                    {ev.wait && <span className="text-xs text-gray-500">видео готовится…</span>}
                    {ev.rec && (
                      <a href={`${recUrl(ev.cam, ev.rec.file)}#t=${ev.rec.offset}`} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-xs hover:bg-white/10">
                        <Play className="w-3.5 h-3.5" /> Полная запись
                      </a>
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
