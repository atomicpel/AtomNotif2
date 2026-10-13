// API сервис для подключения к cctv_server.py
// Сервер работает на порту 8080 и возвращает HTML страницы

export const API_BASE = 'http://localhost:8080';

// Проверка соединения с сервером
export async function checkConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/`, {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return true; // no-cors всегда возвращает opaque response, но если fetch не упал — сервер доступен
  } catch {
    return false;
  }
}

// Получить URL для HLS потока
export function getHlsUrl(streamName: string): string {
  return `${API_BASE}/hls/${streamName}/index.m3u8`;
}

// Получить URL для видео события
export function getClipUrl(camera: string, filename: string): string {
  return `${API_BASE}/clip/${encodeURIComponent(camera)}/${encodeURIComponent(filename)}`;
}

// Получить URL для записи
export function getRecordingUrl(camera: string, filename: string): string {
  return `${API_BASE}/rec/${encodeURIComponent(camera)}/${encodeURIComponent(filename)}`;
}

// Получить URL для снимка события
export function getSnapshotUrl(filename: string): string {
  return `${API_BASE}/snap/${encodeURIComponent(filename)}`;
}

// Получить URL для текущего кадра камеры
export function getFrameUrl(cameraName: string): string {
  return `${API_BASE}/frame/${encodeURIComponent(cameraName)}`;
}

// Получить URL для страницы событий
export function getEventsPageUrl(date?: string): string {
  const params = date ? `?date=${date}` : '';
  return `${API_BASE}/events${params}`;
}

// Получить URL для страницы архива
export function getArchivePageUrl(cam?: string, date?: string): string {
  const params = new URLSearchParams();
  if (cam) params.set('cam', cam);
  if (date) params.set('date', date);
  return `${API_BASE}/archive?${params.toString()}`;
}

// Получить URL для страницы настроек
export function getSettingsPageUrl(): string {
  return `${API_BASE}/manage`;
}

// Получить URL для зон игнорирования камеры
export function getZonesPageUrl(cameraName: string): string {
  return `${API_BASE}/zones/${encodeURIComponent(cameraName)}`;
}

// Получить URL для проксируемого видео (WebRTC/HLS)
export function getProxiedStreamUrl(cameraName: string, mode: 'webrtc' | 'hls' = 'hls'): string {
  return `${API_BASE}/grid?cam=${encodeURIComponent(cameraName)}&mode=${mode}&proxied=1`;
}

// Отправить тестовое уведомление
export async function testNotification(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/test-notify`, {
      method: 'POST',
      credentials: 'include',
      mode: 'no-cors',
    });
    return true;
  } catch {
    return false;
  }
}
