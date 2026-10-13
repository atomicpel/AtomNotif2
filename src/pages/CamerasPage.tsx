import { useState, useEffect } from 'react';
import { Camera, Wifi, WifiOff, Maximize2, Eye, Video, Grid3x3, List } from 'lucide-react';
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
    <div className="space-y-6 p-5">
      {/* Hero Stats */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 shadow-2xl shadow-purple-500/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">{cameras.length} камер</h2>
          <p className="text-white/80 text-sm mb-4">Система видеонаблюдения активна</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20">
              <p className="text-2xl font-bold text-white">{onlineCount}</p>
              <p className="text-xs text-white/70">Онлайн</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20">
              <p className="text-2xl font-bold text-white">{cameras.filter(c => c.recording).length}</p>
              <p className="text-xs text-white/70">Запись</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20">
              <p className="text-2xl font-bold text-white">{cameras.filter(c => c.detecting).length}</p>
              <p className="text-xs text-white/70">AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Все камеры</h3>
        <div className="flex items-center bg-white/5 backdrop-blur-xl rounded-2xl p-1 border border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50' : 'text-gray-500'}`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50' : 'text-gray-500'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Camera Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-4">
          {cameras.map(cam => (
            <button
              key={cam.name}
              onClick={() => setSelectedCam(cam.name)}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 active:scale-[0.97] transition-all shadow-xl"
            >
              {/* Video preview */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
                {cam.online && serverConnected ? (
                  <img
                    src={getFrameUrl(cam.name)}
                    alt={cam.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : cam.online ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-10 h-10 text-gray-700" />
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <WifiOff className="w-8 h-8 text-red-500/40" />
                  </div>
                )}
                
                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-bold backdrop-blur-xl ${
                    cam.online 
                      ? 'bg-emerald-500/80 text-white shadow-lg shadow-emerald-500/50' 
                      : 'bg-red-500/80 text-white shadow-lg shadow-red-500/50'
                  }`}>
                    {cam.online ? '● LIVE' : '○ OFF'}
                  </div>
                </div>

                {/* Recording indicator */}
                {cam.recording && cam.online && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] text-white/90 font-semibold">REC</span>
                  </div>
                )}

                {/* AI badge */}
                {cam.detecting && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-purple-500/80 backdrop-blur-xl">
                    <span className="text-[9px] text-white font-bold">AI</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-sm font-bold text-white truncate">{cam.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-gray-500">{cam.type}</span>
                  <span className="text-[10px] text-gray-600">{cam.lastMotion}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="space-y-3">
          {cameras.map(cam => (
            <button
              key={cam.name}
              onClick={() => setSelectedCam(cam.name)}
              className="w-full group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 active:scale-[0.98] transition-all p-4 flex items-center gap-4"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                cam.online 
                  ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30' 
                  : 'bg-white/5 border border-white/10'
              }`}>
                {cam.online ? (
                  <Camera className="w-6 h-6 text-emerald-400" />
                ) : (
                  <WifiOff className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-base font-bold text-white">{cam.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{cam.type} • {cam.lastMotion}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {cam.online && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50" />
                )}
                {cam.recording && (
                  <span className="text-[10px] text-cyan-400 font-bold">REC</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Camera detail modal */}
      {selectedCam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center animate-in fade-in" onClick={() => setSelectedCam(null)}>
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-auto border-t border-white/10" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{selectedCam}</h3>
              <button onClick={() => setSelectedCam(null)} className="p-2 rounded-2xl bg-white/5 active:bg-white/10 border border-white/10">
                <span className="text-gray-400 text-xl">✕</span>
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
                  <Camera className="w-16 h-16 text-gray-700" />
                </div>
              )}
            </div>
            <div className="p-5 space-y-4">
              {serverConnected && (
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={getFrameUrl(selectedCam)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold active:opacity-80 shadow-lg shadow-indigo-500/50"
                  >
                    <Eye className="w-5 h-5" /> Кадр
                  </a>
                  <a
                    href={`${API_BASE}/zones/${selectedCam}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 text-white text-sm font-bold active:bg-white/10 border border-white/10"
                  >
                    <Maximize2 className="w-5 h-5" /> Зоны
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
