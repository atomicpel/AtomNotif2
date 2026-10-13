import { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, HardDrive } from 'lucide-react';
import { API_BASE, checkConnection } from '../api';

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
    <div className="space-y-4 p-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">На диске</p>
          <p className="text-xl font-bold mt-0.5 text-[#21A038]">142 ГБ</p>
        </div>
        <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Свободно</p>
          <p className="text-xl font-bold mt-0.5 text-amber-400">158 ГБ</p>
        </div>
      </div>

      {/* Camera selector */}
      <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Камера</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {cameras.map(cam => (
            <button
              key={cam}
              onClick={() => setSelectedCam(cam)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedCam === cam
                  ? 'bg-[#21A038] text-white'
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              {cam}
            </button>
          ))}
        </div>
      </div>

      {/* Date selector */}
      <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Дата</p>
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-xl bg-white/5 active:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="flex-1 bg-transparent text-center text-sm font-medium text-white"
          />
          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-xl bg-white/5 active:bg-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Таймлайн</p>
        <div className="flex gap-0.5 h-10 rounded-xl overflow-hidden">
          {Array.from({ length: 24 }, (_, i) => {
            const hasData = Math.random() > 0.2;
            const isMotion = Math.random() > 0.7;
            return (
              <div
                key={i}
                className={`flex-1 rounded-sm transition-all active:opacity-70 ${
                  hasData
                    ? isMotion
                      ? 'bg-amber-500/60'
                      : 'bg-[#21A038]/40'
                    : 'bg-white/5'
                }`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[9px] text-gray-600">00</span>
          <span className="text-[9px] text-gray-600">06</span>
          <span className="text-[9px] text-gray-600">12</span>
          <span className="text-[9px] text-gray-600">18</span>
          <span className="text-[9px] text-gray-600">24</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-[#21A038]/40" />
            <span className="text-[9px] text-gray-500">Запись</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-amber-500/60" />
            <span className="text-[9px] text-gray-500">Движение</span>
          </div>
        </div>
      </div>

      {/* Files grid */}
      <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Файлы</p>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }, (_, i) => {
            const hour = i * 2;
            const time = `${String(hour).padStart(2, '0')}:00`;
            return (
              <button
                key={i}
                className="aspect-square rounded-xl bg-white/5 active:bg-white/10 flex flex-col items-center justify-center gap-1"
              >
                <Play className="w-4 h-4 text-gray-500" />
                <span className="text-[10px] text-gray-500">{time}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage info */}
      <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <HardDrive className="w-4 h-4 text-gray-500" />
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Хранилище</p>
        </div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-gray-400">Использовано</span>
              <span className="text-white">142 / 300 ГБ</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#21A038] rounded-full" style={{ width: '47%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
