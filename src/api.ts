// API для cctv_server.py — относительные пути, работает и дома, и через туннель

export const API_BASE = '';  // same-origin

async function req<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...opts,
    headers: {
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
      ...opts.headers,
    },
  });
  if (res.status === 401) throw new Error('auth');
  if (res.status === 403) throw new Error('forbidden');
  if (!res.ok) throw new Error(`http ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return undefined as T;
}

export async function getStatus() {
  return req<{
    cameras: Array<{
      name: string;
      online: boolean;
      recording: boolean;
      detecting: boolean;
      record: boolean;
      detect: boolean;
      has_sub: boolean;
      url_masked: string;
    }>;
    record_enabled: boolean;
    detect_enabled: boolean;
    clip_enabled: boolean;
    disk_used_gb: number;
    disk_free_gb: number;
    disk_files: number;
    tunnel: boolean;
    tunnel_up: boolean;
    ai: boolean;
    mtx: boolean;
    hls_mode: string;
    user: string;
    role: string;
  }>('/api/status');
}

export async function getEvents(date?: string) {
  const q = date ? `?date=${date}` : '';
  return req<{ date: string; events: Array<{
    cam: string;
    ts: number;
    time: string;
    labels: string[];
    img?: string;
    clip?: string;
    wait?: boolean;
    rec?: { file: string; offset: number } | null;
  }> }>(`/api/events${q}`);
}

export type FileInfo = { name: string; size_mb: number; time: string };

export async function getArchive(cam?: string, date?: string) {
  const p = new URLSearchParams();
  if (cam) p.set('cam', cam);
  if (date) p.set('date', date);
  return req<{ cameras: string[]; cam: string; date: string; files: FileInfo[]; clips: FileInfo[] }>(
    `/api/archive?${p}`
  );
}

export async function getConfig() {
  return req<any>('/api/config');
}

export async function saveSettings(data: Record<string, any>) {
  return req('/api/settings', { method: 'POST', body: JSON.stringify(data) });
}

export async function addCamera(name: string, url: string, detect_url = '') {
  return req('/api/cameras', { method: 'POST', body: JSON.stringify({ name, url, detect_url }) });
}

export async function editCamera(name: string, data: Record<string, any>) {
  return req(`/api/cameras/${encodeURIComponent(name)}`, { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteCamera(name: string) {
  return req(`/api/cameras/${encodeURIComponent(name)}`, { method: 'DELETE' });
}

export async function addUser(name: string, password: string, role: string) {
  return req('/api/users', { method: 'POST', body: JSON.stringify({ name, password, role }) });
}

export async function deleteUser(name: string) {
  return req(`/api/users/${encodeURIComponent(name)}`, { method: 'DELETE' });
}

export async function testNotify() {
  return req('/api/test-notify', { method: 'POST' });
}

export const frameUrl = (name: string, t = 0) => `/frame/${encodeURIComponent(name)}?t=${t}`;
export const snapUrl = (img: string) => `/snap/${encodeURIComponent(img)}`;
export const clipUrl = (path: string) => `/clip/${path}`;
export const recUrl = (cam: string, file: string) => `/rec/${encodeURIComponent(cam)}/${encodeURIComponent(file)}`;
// sub = true: лёгкий подпоток камеры (<имя>_sub), меньше трафика и задержка при просмотре с телефона
export const hlsPlayerUrl = (name: string, sub = false) => `/hls/${encodeURIComponent(sub ? name + '_sub' : name)}/`;

// Сегодняшняя дата по МЕСТНОМУ времени (toISOString даёт UTC и ночью показывал бы вчера)
export const todayLocal = () => {
  const d = new Date(); const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export async function getLogs(lines = 300, level?: string) {
  const q = new URLSearchParams({ lines: String(lines) });
  if (level) q.set('level', level);
  return req<{ lines: string[]; count: number }>(`/api/logs?${q}`);
}
