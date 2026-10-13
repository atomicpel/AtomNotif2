import { useState, useEffect } from 'react';
import { Camera, WifiOff, Eye, Grid3x3, List } from 'lucide-react';
import { API_BASE, checkConnection, getFrameUrl, getProxiedStreamUrl } from '../api';

interface CameraData {
  name: string;
  online: boolean;
  recording: boolean;
  detecting: boolean;
  type: string;
  lastMotion: string;
}

const demoCameras: CameraData[] = [
  { name: 'Вход', online: true, recording: true, detecting: true, type: 'Hikvision', lastMotion: '2 мин' },
  { name: 'Двор', online: true, recording: true, detecting: true, type: 'Dahua', lastMotion: '15 мин' },
  { name: 'Гараж', online: true, recording: true, detecting: true, type: 'Reolink', lastMotion: '1 час' },
  { name: 'Задний двор', online: false, recording: false, detecting: false, type: 'Axis', lastMotion: '3 дня' },
  { name: 'Калитка', online: true, recording: true, detecting: true, type: 'Hikvision', lastMotion: '30 мин' },
  { name: 'Парковка', online: true, recording: true, detecting: false, type: 'Dahua', lastMotion: '5 мин' },
];

export default function CamerasPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCam, setSelectedCam] = useState<string | null>(null);
  const [serverConnected, setServerConnected] = useState<boolean | null>(null);

  useEffect(() => {
    checkConnection().then(setServerConnected);
  }, []);

  const onlineCount = demoCameras.filter(c => c.online).length;

  return (
    <div className="p-4 space-y-4">
      {/* Compact stats */}
      <div className="flex gap-2">
        <div className="flex-1 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
          <p className="text-[10px] text-gray-500">Всего</p>
          <p className="text-sm font-semibold text-white">{demoCameras.length}</p>
        </div>
        <div className="flex-1 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
          <p className="text-[10px] text-emerald-400">Онлайн</p>
          <p className="text-sm font-semibold text-emerald-400">{onlineCount}</p>
        </div>
        <div className="flex-1 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
          <p className="text-[10px] text-cyan-400">Запись</p>
          <p className="text-sm font-semibold text-cyan-400">{demoCameras.filter(c => c.recording).length}</p>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 font-medium">Все камеры</p>
        <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-500'}`}
          >
            <Grid3x3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-500'}`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Camera Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-2.5">
          {demoCameras.map(cam => (
            <button
              key={cam.name}
              onClick={() => setSelectedCam(cam.name)}
              className="bg-white/5 rounded-xl overflow-hidden border border-white/5 active:scale-[0.98] transition-transform"
            >
              <div className="relative aspect-video bg-black/50">
                {cam.online && serverConnected ? (
                  <img
                    src={getFrameUrl(cam.name)}
                    alt={cam.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : cam.online ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-700" />
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <WifiOff className="w-5 h-5 text-red-500/30" />
                  </div>
                )}
                <div className="absolute top-1.5 left-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    cam.online ? 'bg-emerald-500/80 text-white' : 'bg-red-500/80 text-white'
                  }`}>
                    {cam.online ? 'LIVE' : 'OFF'}
                  </span>
                </div>
                {cam.recording && cam.online && (
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5">
                    <div className="w-1 h-1 rounded-full bg-red-500" />
                    <span className="text-[7px] text-white/70 font-medium">REC</span>
                  </div>
                )}
              </div>
              <div className="p-2">
                <h3 className="text-[11px] font-semibold text-white truncate">{cam.name}</h3>
                <p className="text-[9px] text-gray-500 mt-0.5">{cam.type}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {demoCameras.map(cam => (
            <button
              key={cam.name}
              onClick={() => setSelectedCam(cam.name)}
              className="w-full bg-white/5 rounded-xl p-3 border border-white/5 active:scale-[0.99] transition-transform flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                cam.online ? 'bg-emerald-500/10' : 'bg-white/5'
              }`}>
                {cam.online ? (
                  <Camera className="w-4 h-4 text-emerald-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xs font-semibold text-white">{cam.name}</h3>
                <p className="text-[10px] text-gray-500">{cam.type} • {cam.lastMotion}</p>
              </div>
              {cam.online && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedCam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end" onClick={() => setSelectedCam(null)}>
          <div className="bg-[#1a1a1f] w-full rounded-t-2xl max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-3 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-semibold">{selectedCam}</h3>
              <button onClick={() => setSelectedCam(null)} className="p-1.5 rounded-lg bg-white/5">
                <span className="text-gray-400 text-sm">✕</span>
              </button>
            </div>
            <div className="aspect-video bg-black">
              {serverConnected ? (
                <iframe
                  src={getProxiedStreamUrl(selectedCam, 'hls')}
                  className="w-full h-full border-0"
                  title={selectedCam}
                  allow="autoplay; fullscreen"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-10 h-10 text-gray-700" />
                </div>
              )}
            </div>
            <div className="p-3 flex gap-2">
              {serverConnected && (
                <>
                  <a
                    href={getFrameUrl(selectedCam)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-medium active:opacity-80"
                  >
                    <Eye className="w-3.5 h-3.5" /> Кадр
                  </a>
                  <a
                    href={`${API_BASE}/zones/${selectedCam}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 text-white text-xs font-medium active:bg-white/10 border border-white/10"
                  >
                    Зоны
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
