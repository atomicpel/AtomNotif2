import { useState, useEffect } from 'react';
import { User, Car, PawPrint, Play, Film, Clock, Camera, TrendingUp } from 'lucide-react';
import { API_BASE, checkConnection, getEventsPageUrl } from '../api';

interface Event {
  id: number;
  cam: string;
  time: string;
  labels: string[];
  hasClip: boolean;
}

const demoEvents: Event[] = [
  { id: 1, cam: 'Вход', time: '14:32', labels: ['человек'], hasClip: true },
  { id: 2, cam: 'Двор', time: '14:28', labels: ['человек', 'машина'], hasClip: true },
  { id: 3, cam: 'Калитка', time: '14:15', labels: ['человек'], hasClip: true },
  { id: 4, cam: 'Гараж', time: '13:50', labels: ['животное'], hasClip: false },
  { id: 5, cam: 'Вход', time: '13:45', labels: ['человек'], hasClip: true },
  { id: 6, cam: 'Парковка', time: '13:30', labels: ['машина'], hasClip: true },
  { id: 7, cam: 'Двор', time: '12:15', labels: ['человек'], hasClip: true },
  { id: 8, cam: 'Вход', time: '11:42', labels: ['человек', 'машина'], hasClip: true },
];

const labelIcons: Record<string, typeof User> = {
  'человек': User,
  'машина': Car,
  'животное': PawPrint,
};

const labelColors: Record<string, string> = {
  'человек': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'машина': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'животное': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

export default function EventsPage() {
  const [filter, setFilter] = useState<string>('all');
  const [serverConnected, setServerConnected] = useState<boolean | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    checkConnection().then(setServerConnected);
  }, []);

  const filtered = filter === 'all' ? demoEvents : demoEvents.filter(e => e.labels.includes(filter));

  const filters = [
    { key: 'all', label: 'Все', count: demoEvents.length, icon: TrendingUp },
    { key: 'человек', label: 'Люди', count: demoEvents.filter(e => e.labels.includes('человек')).length, icon: User },
    { key: 'машина', label: 'Машины', count: demoEvents.filter(e => e.labels.includes('машина')).length, icon: Car },
    { key: 'животное', label: 'Животные', count: demoEvents.filter(e => e.labels.includes('животное')).length, icon: PawPrint },
  ];

  return (
    <div className="space-y-6 p-5">
      {/* Hero Stats */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 p-6 shadow-2xl shadow-orange-500/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">{demoEvents.length} событий</h2>
          <p className="text-white/80 text-sm mb-4">Обнаружено сегодня</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <p className="text-3xl font-bold text-white">{demoEvents.filter(e => e.labels.includes('человек')).length}</p>
              <p className="text-xs text-white/70 mt-1">Люди</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <p className="text-3xl font-bold text-white">{demoEvents.filter(e => e.hasClip).length}</p>
              <p className="text-xs text-white/70 mt-1">Видео</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
        {filters.map(({ key, label, count, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
              filter === key
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/50'
                : 'bg-white/5 text-gray-400 border border-white/10 backdrop-blur-xl'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              filter === key ? 'bg-white/20' : 'bg-white/5'
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Server link */}
      {serverConnected && (
        <a
          href={getEventsPageUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-4 border border-white/10 active:bg-white/10 transition-all"
        >
          <span className="text-sm text-gray-300">Открыть на сервере</span>
          <span className="text-indigo-400 text-lg">→</span>
        </a>
      )}

      {/* Events list */}
      <div className="space-y-3">
        {filtered.map(ev => (
          <button
            key={ev.id}
            onClick={() => setSelectedEvent(ev)}
            className="w-full group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 active:scale-[0.98] transition-all p-4"
          >
            <div className="flex items-start gap-4">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0 relative border border-white/10">
                <Camera className="w-6 h-6 text-gray-600" />
                {ev.hasClip && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                    <Play className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{ev.cam}</h3>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ev.time}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ev.labels.map(label => {
                    const Icon = labelIcons[label] || User;
                    return (
                      <span key={label} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border ${labelColors[label]}`}>
                        <Icon className="w-3 h-3" />
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center animate-in fade-in" onClick={() => setSelectedEvent(null)}>
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl border-t border-white/10" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedEvent.cam}</h3>
                <p className="text-sm text-gray-500 mt-1">Сегодня в {selectedEvent.time}</p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-2 rounded-2xl bg-white/5 active:bg-white/10 border border-white/10">
                <span className="text-gray-400 text-xl">✕</span>
              </button>
            </div>
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              <Camera className="w-16 h-16 text-gray-700" />
            </div>
            <div className="p-5 space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedEvent.labels.map(label => {
                  const Icon = labelIcons[label] || User;
                  return (
                    <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${labelColors[label]}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </span>
                  );
                })}
              </div>
              {selectedEvent.hasClip && serverConnected && (
                <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold active:opacity-80 shadow-lg shadow-indigo-500/50">
                  <Film className="w-5 h-5" /> Смотреть видео
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
