import { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, HardDrive, Calendar } from 'lucide-react';
import { checkConnection } from '../api';

const cameras = ['Вход', 'Двор', 'Гараж', 'Калитка', 'Парковка'];

export default function ArchivePage() {
  const [selectedCam, setSelectedCam] = useState(cameras[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [serverConnected, setServerConnected] = useState<boolean | null>(null);

  useEffect(() => {
    checkConnection().then(setServerConnected);
  }, []);

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Compact stats */}
      <div className="flex gap-2">
        <div className="flex-1 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
          <p className="text-[10px] text-gray-500">Занято</p>
          <p className="text-sm font-semibold text-white">142 ГБ</p>
        </div>
        <div className="flex-1 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
          <p className="text-[10px] text-emerald-400">Свободно</p>
          <p className="text-sm font-semibold text-emerald-400">158 ГБ</p>
        </div>
      </div>

      {/* Camera selector */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
        <p className="text-[10px] text-gray-500 mb-2 font-medium">Камера</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {cameras.map(cam => (
            <button
              key={cam}
              onClick={() => setSelectedCam(cam)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition ${
                selectedCam === cam
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-white/5 text-gray-400 border border-white/5'
              }`}
            >
              {cam}
            </button>
          ))}
        </div>
      </div>

      {/* Date selector */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
        <p className="text-[10px] text-gray-500 mb-2 font-medium flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Дата
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-lg bg-white/5 active:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="flex-1 bg-transparent text-center text-xs font-medium text-white"
          />
          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-lg bg-white/5 active:bg-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
        <p className="text-[10px] text-gray-500 mb-2 font-medium">Таймлайн</p>
        <div className="flex gap-0.5 h-8 rounded-lg overflow-hidden">
          {Array.from({ length: 24 }, (_, i) => {
            const hasData = Math.random() > 0.2;
            const isMotion = Math.random() > 0.7;
            return (
              <div
                key={i}
                className={`flex-1 rounded-sm ${
                  hasData
                    ? isMotion
                      ? 'bg-amber-500/50'
                      : 'bg-emerald-500/40'
                    : 'bg-white/5'
                }`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[8px] text-gray-600">00</span>
          <span className="text-[8px] text-gray-600">06</span>
          <span className="text-[8px] text-gray-600">12</span>
          <span className="text-[8px] text-gray-600">18</span>
          <span className="text-[8px] text-gray-600">24</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-emerald-500/40" />
            <span className="text-[9px] text-gray-500">Запись</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-amber-500/50" />
            <span className="text-[9px] text-gray-500">Движение</span>
          </div>
        </div>
      </div>

      {/* Files grid */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
        <p className="text-[10px] text-gray-500 mb-2 font-medium">Файлы</p>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }, (_, i) => {
            const hour = i * 3 + 6;
            const time = `${String(hour).padStart(2, '0')}:00`;
            return (
              <button
                key={i}
                className="aspect-square rounded-lg bg-white/5 active:bg-white/10 flex flex-col items-center justify-center gap-1 border border-white/5"
              >
                <Play className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[9px] text-gray-500">{time}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage info */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
        <p className="text-[10px] text-gray-500 mb-2 font-medium flex items-center gap-1">
          <HardDrive className="w-3 h-3" />
          Хранилище
        </p>
        <div>
          <div className="flex justify-between text-[10px] mb-1.5">
            <span className="text-gray-400">Использовано</span>
            <span className="text-white font-medium">142 / 300 ГБ</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '47%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
