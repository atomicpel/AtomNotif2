import { useState, useEffect } from 'react';
import { User, Car, PawPrint, Play, Clock, Camera } from 'lucide-react';
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
  'человек': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'машина': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'животное': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
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
    { key: 'all', label: 'Все' },
    { key: 'человек', label: 'Люди' },
    { key: 'машина', label: 'Машины' },
    { key: 'животное', label: 'Животные' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 lg:gap-4">
        <div className="bg-white/5 rounded-xl p-3 lg:p-4 border border-white/5">
          <p className="text-[10px] lg:text-xs text-gray-500">Сегодня</p>
          <p className="text-lg lg:text-2xl font-semibold text-white mt-1">{demoEvents.length}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 lg:p-4 border border-white/5">
          <p className="text-[10px] lg:text-xs text-amber-400">Люди</p>
          <p className="text-lg lg:text-2xl font-semibold text-amber-400 mt-1">{demoEvents.filter(e => e.labels.includes('человек')).length}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 lg:p-4 border border-white/5">
          <p className="text-[10px] lg:text-xs text-purple-400">Видео</p>
          <p className="text-lg lg:text-2xl font-semibold text-purple-400 mt-1">{demoEvents.filter(e => e.hasClip).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 lg:gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-[11px] lg:text-sm font-medium whitespace-nowrap transition ${
              filter === key
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-white/5 text-gray-400 border border-white/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Server link */}
      {serverConnected && (
        <a
          href={getEventsPageUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-white/5 rounded-xl px-3 lg:px-4 py-2.5 lg:py-3 border border-white/5 active:bg-white/10 hover:border-white/10 transition"
        >
          <span className="text-[11px] lg:text-sm text-gray-400">Открыть на сервере</span>
          <span className="text-indigo-400 text-sm lg:text-base">→</span>
        </a>
      )}

      {/* Events list */}
      <div className="space-y-2 lg:space-y-3">
        {filtered.map(ev => (
          <button
            key={ev.id}
            onClick={() => setSelectedEvent(ev)}
            className="w-full bg-white/5 rounded-xl p-3 lg:p-4 border border-white/5 active:scale-[0.99] hover:border-white/10 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-black/30 flex items-center justify-center flex-shrink-0 relative">
                <Camera className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700" />
                {ev.hasClip && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Play className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white fill-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs lg:text-sm font-semibold text-white">{ev.cam}</h3>
                  <span className="text-[10px] lg:text-xs text-gray-500 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                    {ev.time}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 lg:gap-1.5 mt-1.5">
                  {ev.labels.map(label => {
                    const Icon = labelIcons[label] || User;
                    return (
                      <span key={label} className={`inline-flex items-center gap-0.5 lg:gap-1 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded text-[9px] lg:text-[10px] border ${labelColors[label]}`}>
                        <Icon className="w-2 h-2 lg:w-2.5 lg:h-2.5" />
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

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end lg:items-center justify-center" onClick={() => setSelectedEvent(null)}>
          <div className="bg-[#1a1a1f] w-full lg:max-w-2xl lg:rounded-2xl rounded-t-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-3 lg:p-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-sm lg:text-base font-semibold">{selectedEvent.cam}</h3>
                <p className="text-[10px] lg:text-xs text-gray-500 mt-0.5">Сегодня в {selectedEvent.time}</p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-1.5 lg:p-2 rounded-lg bg-white/5">
                <span className="text-gray-400 text-sm">✕</span>
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <Camera className="w-10 h-10 lg:w-12 lg:h-12 text-gray-700" />
            </div>
            <div className="p-3 lg:p-4 space-y-3">
              <div className="flex flex-wrap gap-1.5 lg:gap-2">
                {selectedEvent.labels.map(label => {
                  const Icon = labelIcons[label] || User;
                  return (
                    <span key={label} className={`inline-flex items-center gap-1 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg text-[10px] lg:text-xs border ${labelColors[label]}`}>
                      <Icon className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                      {label}
                    </span>
                  );
                })}
              </div>
              {selectedEvent.hasClip && serverConnected && (
                <button className="w-full flex items-center justify-center gap-1.5 py-2.5 lg:py-3 rounded-xl bg-indigo-500 text-white text-xs lg:text-sm font-medium active:opacity-80">
                  <Play className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Смотреть видео
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
