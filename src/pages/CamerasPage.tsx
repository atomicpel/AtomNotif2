import { useState } from 'react';
import { Camera, Wifi, WifiOff, Play, Maximize2, Settings, Eye } from 'lucide-react';

interface CameraData {
  name: string;
  online: boolean;
  recording: boolean;
  detecting: boolean;
  url: string;
  lastMotion: string;
  type: string;
}

const cameras: CameraData[] = [
  { name: 'Вход', online: true, recording: true, detecting: true, url: 'rtsp://192.168.1.10:554/stream1', lastMotion: '2 мин назад', type: 'Hikvision DS-2CD' },
  { name: 'Двор', online: true, recording: true, detecting: true, url: 'rtsp://192.168.1.11:554/stream1', lastMotion: '15 мин назад', type: 'Dahua IPC-HDW' },
  { name: 'Гараж', online: true, recording: true, detecting: true, url: 'rtsp://192.168.1.12:554/stream1', lastMotion: '1 час назад', type: 'Reolink RLC-810A' },
  { name: 'Задний двор', online: false, recording: false, detecting: false, url: 'rtsp://192.168.1.13:554/stream1', lastMotion: '3 дня назад', type: 'Axis P3245-V' },
  { name: 'Калитка', online: true, recording: true, detecting: true, url: 'rtsp://192.168.1.14:554/stream1', lastMotion: '30 мин назад', type: 'Hikvision DS-2CD' },
  { name: 'Парковка', online: true, recording: true, detecting: false, url: 'rtsp://192.168.1.15:554/stream1', lastMotion: '5 мин назад', type: 'Dahua IPC-HDW' },
];

export default function CamerasPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [selectedCam, setSelectedCam] = useState<string | null>(null);
  const [mode, setMode] = useState<'webrtc' | 'hls'>('webrtc');

  const onlineCount = cameras.filter(c => c.online).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Камеры</h2>
          <p className="text-sm text-gray-500 mt-1">
            {onlineCount} из {cameras.length} камер в сети
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#161b22] rounded-lg border border-gray-800 p-0.5">
            <button
              onClick={() => setMode('webrtc')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${mode === 'webrtc' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              WebRTC
            </button>
            <button
              onClick={() => setMode('hls')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${mode === 'hls' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              HLS
            </button>
          </div>
          <div className="flex items-center bg-[#161b22] rounded-lg border border-gray-800 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Сетка
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${viewMode === 'single' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Одна
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Всего камер</p>
          <p className="text-2xl font-bold mt-1">{cameras.length}</p>
        </div>
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">В сети</p>
          <p className="text-2xl font-bold mt-1 text-emerald-400">{onlineCount}</p>
        </div>
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Запись</p>
          <p className="text-2xl font-bold mt-1 text-cyan-400">{cameras.filter(c => c.recording).length}</p>
        </div>
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Детекция</p>
          <p className="text-2xl font-bold mt-1 text-purple-400">{cameras.filter(c => c.detecting).length}</p>
        </div>
      </div>

      {/* Camera Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cameras.map(cam => (
            <div
              key={cam.name}
              className="bg-[#161b22] rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition group"
            >
              {/* Video placeholder */}
              <div className="relative aspect-video bg-black">
                {cam.online ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-2">
                          <Camera className="w-7 h-7 text-emerald-500/60" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Поток активен</p>
                    </div>
                    {/* Scan line effect */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute w-full h-px bg-emerald-500/20 animate-scan" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <WifiOff className="w-10 h-10 text-red-500/50 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">Нет сигнала</p>
                    </div>
                  </div>
                )}
                {/* Overlay controls */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${cam.online ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {cam.online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    {cam.online ? 'LIVE' : 'OFF'}
                  </div>
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{cam.name}</h3>
                  <div className="flex gap-1">
                    {cam.recording && <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">REC</span>}
                    {cam.detecting && <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20">AI</span>}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{cam.type}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600">Движение: {cam.lastMotion}</span>
                  <button
                    onClick={() => { setSelectedCam(cam.name); setViewMode('single'); }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> Смотреть
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Single view */
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {cameras.map(cam => (
              <button
                key={cam.name}
                onClick={() => setSelectedCam(cam.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCam === cam.name
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                    : 'bg-[#161b22] text-gray-400 border border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${cam.online ? 'bg-emerald-400' : 'bg-red-400'}`} />
                {cam.name}
              </button>
            ))}
          </div>
          <div className="bg-[#161b22] rounded-xl border border-gray-800 overflow-hidden">
            <div className="aspect-video bg-black flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-10 h-10 text-emerald-500/60" />
                </div>
                <p className="text-sm text-gray-400">{selectedCam || 'Выберите камеру'}</p>
                <p className="text-xs text-gray-600 mt-1">Режим: {mode.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
