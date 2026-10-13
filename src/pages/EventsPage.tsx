import { useState } from 'react';
import { Bell, Camera, Clock, User, Car, PawPrint, Play, Film } from 'lucide-react';

interface Event {
  id: number;
  cam: string;
  ts: string;
  time: string;
  labels: string[];
  hasClip: boolean;
  hasRecording: boolean;
}

const events: Event[] = [
  { id: 1, cam: 'Вход', ts: '2026-10-13 14:32:15', time: '14:32:15', labels: ['человек'], hasClip: true, hasRecording: true },
  { id: 2, cam: 'Двор', ts: '2026-10-13 14:28:03', time: '14:28:03', labels: ['человек', 'машина'], hasClip: true, hasRecording: true },
  { id: 3, cam: 'Калитка', ts: '2026-10-13 14:15:47', time: '14:15:47', labels: ['человек'], hasClip: true, hasRecording: true },
  { id: 4, cam: 'Гараж', ts: '2026-10-13 13:50:22', time: '13:50:22', labels: ['животное'], hasClip: false, hasRecording: true },
  { id: 5, cam: 'Вход', ts: '2026-10-13 13:45:10', time: '13:45:10', labels: ['человек'], hasClip: true, hasRecording: true },
  { id: 6, cam: 'Парковка', ts: '2026-10-13 13:30:55', time: '13:30:55', labels: ['машина'], hasClip: true, hasRecording: true },
  { id: 7, cam: 'Двор', ts: '2026-10-13 12:15:33', time: '12:15:33', labels: ['человек'], hasClip: true, hasRecording: true },
  { id: 8, cam: 'Вход', ts: '2026-10-13 11:42:08', time: '11:42:08', labels: ['человек', 'машина'], hasClip: true, hasRecording: true },
  { id: 9, cam: 'Калитка', ts: '2026-10-13 10:20:44', time: '10:20:44', labels: ['животное'], hasClip: false, hasRecording: true },
  { id: 10, cam: 'Гараж', ts: '2026-10-13 09:05:19', time: '09:05:19', labels: ['человек'], hasClip: true, hasRecording: true },
];

const labelIcons: Record<string, typeof User> = {
  'человек': User,
  'машина': Car,
  'животное': PawPrint,
};

const labelColors: Record<string, string> = {
  'человек': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'машина': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'животное': 'bg-green-500/10 text-green-400 border-green-500/20',
};

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState('2026-10-13');
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? events : events.filter(e => e.labels.includes(filter));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">События</h2>
          <p className="text-sm text-gray-500 mt-1">Обнаруженные движения и объекты</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="bg-[#161b22] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
        />
        <div className="flex items-center bg-[#161b22] rounded-lg border border-gray-800 p-0.5">
          {[
            { key: 'all', label: 'Все' },
            { key: 'человек', label: '👤 Люди' },
            { key: 'машина', label: '🚗 Машины' },
            { key: 'животное', label: '🐾 Животные' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                filter === key ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Событий сегодня</p>
          <p className="text-2xl font-bold mt-1">{events.length}</p>
        </div>
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Люди</p>
          <p className="text-2xl font-bold mt-1 text-amber-400">{events.filter(e => e.labels.includes('человек')).length}</p>
        </div>
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Машины</p>
          <p className="text-2xl font-bold mt-1 text-blue-400">{events.filter(e => e.labels.includes('машина')).length}</p>
        </div>
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Видео событий</p>
          <p className="text-2xl font-bold mt-1 text-purple-400">{events.filter(e => e.hasClip).length}</p>
        </div>
      </div>

      {/* Events list */}
      <div className="space-y-3">
        {filtered.map(ev => (
          <div key={ev.id} className="bg-[#161b22] rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition">
            <div className="flex flex-col sm:flex-row">
              {/* Snapshot placeholder */}
              <div className="sm:w-48 aspect-video sm:aspect-auto bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative">
                <Camera className="w-8 h-8 text-gray-700" />
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-gray-400">
                  {ev.cam}
                </div>
                {ev.hasClip && (
                  <div className="absolute top-1 right-1 p-1 rounded bg-black/60">
                    <Film className="w-3 h-3 text-purple-400" />
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{ev.cam}</h3>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ev.time}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {ev.labels.map(label => {
                        const Icon = labelIcons[label] || Bell;
                        return (
                          <span key={label} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${labelColors[label] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                            <Icon className="w-3 h-3" />
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  {ev.hasClip && (
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-medium hover:bg-purple-500/20 transition border border-purple-500/20">
                      <Play className="w-3 h-3" /> Видео события
                    </button>
                  )}
                  {ev.hasRecording && (
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition border border-cyan-500/20">
                      <Film className="w-3 h-3" /> Полная запись
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
