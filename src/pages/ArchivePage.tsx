import { useState } from 'react';
import { Archive, Calendar, Play, ChevronLeft, ChevronRight } from 'lucide-react';

const cameras = ['Вход', 'Двор', 'Гараж', 'Задний двор', 'Калитка', 'Парковка'];

const generateFiles = (cam: string, date: string) => {
  const files = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 10) {
      if (Math.random() > 0.3) {
        files.push({
          name: `${date}_${String(h).padStart(2, '0')}-${String(m).padStart(2, '0')}-00.mp4`,
          time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
          size: (Math.random() * 200 + 50).toFixed(0),
        });
      }
    }
  }
  return files;
};

export default function ArchivePage() {
  const [selectedCam, setSelectedCam] = useState(cameras[0]);
  const [selectedDate, setSelectedDate] = useState('2026-10-13');
  const [playingFile, setPlayingFile] = useState<string | null>(null);

  const files = generateFiles(selectedCam, selectedDate);
  const totalSize = files.reduce((acc, f) => acc + parseInt(f.size), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Архив</h2>
          <p className="text-sm text-gray-500 mt-1">Просмотр записей по дате и камере</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Файлов за день</p>
          <p className="text-2xl font-bold mt-1">{files.length}</p>
        </div>
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Объём</p>
          <p className="text-2xl font-bold mt-1 text-cyan-400">{(totalSize / 1024).toFixed(1)} ГБ</p>
        </div>
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Всего на диске</p>
          <p className="text-2xl font-bold mt-1 text-emerald-400">142.3 ГБ</p>
        </div>
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Свободно</p>
          <p className="text-2xl font-bold mt-1 text-amber-400">157.7 ГБ</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedCam}
          onChange={e => setSelectedCam(e.target.value)}
          className="bg-[#161b22] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
        >
          {cameras.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="p-2 rounded-lg bg-[#161b22] border border-gray-800 hover:border-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-[#161b22] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
          />
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="p-2 rounded-lg bg-[#161b22] border border-gray-800 hover:border-gray-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Player */}
      {playingFile && (
        <div className="bg-[#161b22] rounded-xl border border-gray-800 overflow-hidden">
          <div className="aspect-video bg-black flex items-center justify-center">
            <div className="text-center">
              <Play className="w-12 h-12 text-emerald-500/40 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Воспроизведение: {playingFile}</p>
              <p className="text-xs text-gray-600 mt-1">Камера: {selectedCam}</p>
            </div>
          </div>
          <div className="p-3 flex items-center justify-between border-t border-gray-800">
            <span className="text-xs text-gray-500">{playingFile}</span>
            <button
              onClick={() => setPlayingFile(null)}
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          Таймлайн — {selectedDate}
        </h3>
        <div className="flex gap-0.5 h-8 rounded-lg overflow-hidden">
          {Array.from({ length: 48 }, (_, i) => {
            const hasData = Math.random() > 0.2;
            const isMotion = Math.random() > 0.7;
            return (
              <div
                key={i}
                className={`flex-1 rounded-sm transition-all cursor-pointer hover:opacity-80 ${
                  hasData
                    ? isMotion
                      ? 'bg-amber-500/60'
                      : 'bg-emerald-500/40'
                    : 'bg-gray-800'
                }`}
                title={`${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-gray-600">00:00</span>
          <span className="text-[10px] text-gray-600">06:00</span>
          <span className="text-[10px] text-gray-600">12:00</span>
          <span className="text-[10px] text-gray-600">18:00</span>
          <span className="text-[10px] text-gray-600">24:00</span>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-500/40" />
            <span className="text-[10px] text-gray-500">Запись</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-500/60" />
            <span className="text-[10px] text-gray-500">Движение</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gray-800" />
            <span className="text-[10px] text-gray-500">Нет данных</span>
          </div>
        </div>
      </div>

      {/* Files grid */}
      <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Archive className="w-4 h-4 text-gray-500" />
          Файлы ({files.length})
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {files.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setPlayingFile(file.name)}
              className={`p-2 rounded-lg text-center transition border ${
                playingFile === file.name
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 text-gray-400 hover:text-gray-200'
              }`}
            >
              <p className="text-xs font-mono">{file.time}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{file.size} МБ</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
