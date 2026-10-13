import { useState, useEffect } from 'react';
import { Camera, Wifi, WifiOff, Maximize2, Eye, ExternalLink, Video, Grid3x3 } from 'lucide-react';
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
  const [cameras] = useState<CameraData[]>(demoCameras);

  useEffect(() => {
    checkConnection().then(setServerConnected);
  }, []);

  const onlineCount = cameras.filter(c => c.online).length;

  return (
    <div className="space-y-4 p-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Камеры</p>
          <p className="text-xl font-bold mt-0.5">{cameras.length}</p>
        </div>
        <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
          <p className="text-[10px] text-[#21A038] uppercase tracking-wider">Онлайн</p>
          <p className="text-xl font-bold mt-0.5 text-[#21A038]">{onlineCount}</p>
        </div>
        <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
          <p className="text-[10px] text-cyan-400 uppercase tracking-wider">Запись</p>
          <p className="text-xl font-bold mt-0.5 text-cyan-400">{cameras.filter(c => c.recording).length}</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Все камеры</h2>
        <div className="flex items-center bg-[#1c1c1e] rounded-xl p-0.5 border border-white/5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-[#21A038]/20 text-[#21A038]' : 'text-gray-500'}`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-[#21A038]/20 text-[#21A038]' : 'text-gray-500'}`}
          >
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Camera Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-3">
          {cameras.map(cam => (
            <button
              key={cam.name}
              onClick={() => setSelectedCam(cam.name)}
              className="bg-[#1c1c1e] rounded-2xl overflow-hidden border border-white/5 active:scale-[0.98] transition-transform"
            >
              {/* Video preview */}
              <div className="relative aspect-video bg-black">
                {cam.online && serverConnected ? (
                  <img
                    src={getFrameUrl(cam.name)}
                    alt={cam.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : cam.online ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-700" />
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#21A038] animate-pulse" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <WifiOff className="w-6 h-6 text-red-500/40" />
                  </div>
                )}
                {/* Status */}
                <div className="absolute top-1.5 left-1.5">
                  <div className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${cam.online ? 'bg-[#21A038]/80 text-white' : 'bg-red-500/80 text-white'}`}>
                    {cam.online ? 'LIVE' : 'OFF'}
                  </div>
                </div>
                {/* Recording indicator */}
                {cam.recording && cam.online && (
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] text-white/80 font-medium">REC</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-2.5">
                <h3 className="text-xs font-semibold text-white truncate">{cam.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-gray-500">{cam.type}</span>
                  <span className="text-[10px] text-gray-600">{cam.lastMotion}</span>
                </div>
                {cam.detecting && (
                  <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20">
                    <span className="text-[9px] text-purple-400 font-medium">AI</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="space-y-2">
          {cameras.map(cam => (
            <button
              key={cam.name}
              onClick={() => setSelectedCam(cam.name)}
              className="w-full bg-[#1c1c1e] rounded-2xl p-3 border border-white/5 active:scale-[0.99] transition-transform flex items-center gap-3"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cam.online ? 'bg-[#21A038]/15' : 'bg-gray-800'}`}>
                {cam.online ? (
                  <Camera className="w-5 h-5 text-[#21A038]" />
                ) : (
                  <WifiOff className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-sm font-semibold text-white">{cam.name}</h3>
                <p className="text-[11px] text-gray-500">{cam.type} • {cam.lastMotion}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {cam.online && (
                  <div className="w-2 h-2 rounded-full bg-[#21A038]" />
                )}
                {cam.recording && (
                  <span className="text-[9px] text-cyan-400 font-medium">REC</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Camera detail modal */}
      {selectedCam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setSelectedCam(null)}>
          <div className="bg-[#1c1c1e] w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-base font-semibold">{selectedCam}</h3>
              <button onClick={() => setSelectedCam(null)} className="p-2 rounded-xl bg-white/5 active:bg-white/10">
                <span className="text-gray-400 text-lg">✕</span>
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
                  <Camera className="w-12 h-12 text-gray-700" />
                </div>
              )}
            </div>
            <div className="p-4 space-y-3">
              {serverConnected && (
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={getFrameUrl(selectedCam)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#21A038] text-white text-sm font-medium active:opacity-80"
                  >
                    <Eye className="w-4 h-4" /> Кадр
                  </a>
                  <a
                    href={`${API_BASE}/zones/${selectedCam}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white text-sm font-medium active:bg-white/10"
                  >
                    <Maximize2 className="w-4 h-4" /> Зоны
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
