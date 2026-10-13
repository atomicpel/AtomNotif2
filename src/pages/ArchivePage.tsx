import { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, HardDrive, Calendar } from 'lucide-react';
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
    <div className="space-y-6 p-5">
      {/* Hero Stats */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 p-6 shadow-2xl shadow-blue-500/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">Архив</h2>
          <p className="text-white/80 text-sm mb-4">Записи видеонаблюдения</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <p className="text-3xl font-bold text-white">142</p>
              <p className="text-xs text-white/70 mt-1">ГБ занято</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <p className="text-3xl font-bold text-white">158</p>
              <p className="text-xs text-white/70 mt-1">ГБ свободно</p>
            </div>
          </div>
        </div>
      </div>

      {/* Camera selector */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-5 border border-white/10">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Камера</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {cameras.map(cam => (
            <button
              key={cam}
              onClick={() => setSelectedCam(cam)}
              className={`px-4 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCam === cam
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/50'
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              {cam}
            </button>
          ))}
        </div>
      </div>

      {/* Date selector */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-5 border border-white/10">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Дата
        </p>
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => changeDate(-1)}
            className="p-3 rounded-2xl bg-white/5 active:bg-white/10 border border-white/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="flex-1 bg-transparent text-center text-base font-bold text-white"
          />
          <button
            onClick={() => changeDate(1)}
            className="p-3 rounded-2xl bg-white/5 active:bg-white/10 border border-white/10 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-5 border border-white/10">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Таймлайн</p>
        <div className="flex gap-1 h-12 rounded-2xl overflow-hidden">
          {Array.from({ length: 24 }, (_, i) => {
            const hasData = Math.random() > 0.2;
            const isMotion = Math.random() > 0.7;
            return (
              <div
                key={i}
                className={`flex-1 rounded-lg transition-all active:opacity-70 ${
                  hasData
                    ? isMotion
                      ? 'bg-gradient-to-b from-amber-400 to-orange-500'
                      : 'bg-gradient-to-b from-emerald-400 to-teal-500'
                    : 'bg-white/5'
                }`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-3">
          <span className="text-[10px] text-gray-600 font-semibold">00</span>
          <span className="text-[10px] text-gray-600 font-semibold">06</span>
          <span className="text-[10px] text-gray-600 font-semibold">12</span>
          <span className="text-[10px] text-gray-600 font-semibold">18</span>
          <span className="text-[10px] text-gray-600 font-semibold">24</span>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-lg bg-gradient-to-b from-emerald-400 to-teal-500" />
            <span className="text-xs text-gray-400 font-semibold">Запись</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-lg bg-gradient-to-b from-amber-400 to-orange-500" />
            <span className="text-xs text-gray-400 font-semibold">Движение</span>
          </div>
        </div>
      </div>

      {/* Files grid */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-5 border border-white/10">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Файлы</p>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }, (_, i) => {
            const hour = i * 2 + 8;
            const time = `${String(hour).padStart(2, '0')}:00`;
            return (
              <button
                key={i}
                className="aspect-square rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 active:scale-95 transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Play className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-xs text-gray-400 font-semibold">{time}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage info */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-5 border border-white/10">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold flex items-center gap-2">
          <HardDrive className="w-4 h-4" />
          Хранилище
        </p>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400 font-semibold">Использовано</span>
              <span className="text-white font-bold">142 / 300 ГБ</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '47%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
