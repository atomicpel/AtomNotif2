import { useState, useEffect } from 'react';
import { User, Car, PawPrint, Play, Film, Clock, Camera } from 'lucide-react';
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
  'человек': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'машина': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'животное': 'bg-green-500/15 text-green-400 border-green-500/20',
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
    { key: 'all', label: 'Все', count: demoEvents.length },
    { key: 'человек', label: '👤', count: demoEvents.filter(e => e.labels.includes('человек')).length },
    { key: 'машина', label: '🚗', count: demoEvents.filter(e => e.labels.includes('машина')).length },
    { key: 'животное', label: '🐾', count: demoEvents.filter(e => e.labels.includes('животное')).length },
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Сегодня</p>
          <p className="text-2xl font-bold mt-0.5">{demoEvents.length}</p>
        </div>
        <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
          <p className="text-[10px] text-amber-400 uppercase tracking-wider">Люди</p>
          <p className="text-2xl font-bold mt-0.5 text-amber-400">{demoEvents.filter(e => e.labels.includes('человек')).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              filter === key
                ? 'bg-[#21A038] text-white'
                : 'bg-[#1c1c1e] text-gray-400 border border-white/5'
            }`}
          >
            <span>{label}</span>
            <span className={`text-[10px] ${filter === key ? 'text-white/70' : 'text-gray-600'}`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Server link */}
      {serverConnected && (
        <a
          href={getEventsPageUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-[#1c1c1e] rounded-2xl p-3 border border-white/5 active:bg-white/5"
        >
          <span className="text-xs text-gray-400">Открыть на сервере</span>
          <span className="text-[#21A038] text-xs">→</span>
        </a>
      )}

      {/* Events list */}
      <div className="space-y-2">
        {filtered.map(ev => (
          <button
            key={ev.id}
            onClick={() => setSelectedEvent(ev)}
            className="w-full bg-[#1c1c1e] rounded-2xl p-3 border border-white/5 active:scale-[0.99] transition-transform text-left"
          >
            <div className="flex items-start gap-3">
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0 relative">
                <Camera className="w-5 h-5 text-gray-700" />
                {ev.hasClip && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#21A038] flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 text-white fill-white" />
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">{ev.cam}</h3>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ev.time}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {ev.labels.map(label => {
                    const Icon = labelIcons[label] || User;
                    return (
                      <span key={label} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] border ${labelColors[label]}`}>
                        <Icon className="w-2.5 h-2.5" />
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setSelectedEvent(null)}>
          <div className="bg-[#1c1c1e] w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">{selectedEvent.cam}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Сегодня в {selectedEvent.time}</p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-2 rounded-xl bg-white/5 active:bg-white/10">
                <span className="text-gray-400 text-lg">✕</span>
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-700" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {selectedEvent.labels.map(label => {
                  const Icon = labelIcons[label] || User;
                  return (
                    <span key={label} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border ${labelColors[label]}`}>
                      <Icon className="w-3 h-3" />
                      {label}
                    </span>
                  );
                })}
              </div>
              {selectedEvent.hasClip && serverConnected && (
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#21A038] text-white text-sm font-medium active:opacity-80">
                  <Film className="w-4 h-4" /> Смотреть видео
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
