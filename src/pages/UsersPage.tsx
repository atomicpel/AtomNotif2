import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Trash2, RefreshCw, Shield, Eye, WifiOff } from 'lucide-react';
import { getConfig, addUser, deleteUser } from '../api';

export default function UsersPage() {
  const [users, setUsers] = useState<Record<string, { role: string }>>({});
  const [me, setMe] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const c = await getConfig();
      setUsers(c.users || {});
      setError('');
    } catch (e: any) {
      if (e.message === 'forbidden') setError('Только администратор');
      else setError(e.message === 'auth' ? 'Требуется вход' : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    setMsg('');
    try {
      const r = await addUser(name, password, role);
      if (r.ok) {
        setName(''); setPassword(''); setShowAdd(false);
        load();
      } else setMsg('Не удалось: проверьте логин (2–32 символа) и пароль (от 6)');
    } catch {
      setMsg('Ошибка');
    }
  };

  const handleDel = async (n: string) => {
    if (!confirm(`Удалить пользователя ${n}?`)) return;
    try {
      const r = await deleteUser(n);
      if (r && r.ok === false) setMsg('Нельзя удалить последнего администратора');
      load();
    } catch (e: any) {
      setMsg(e.message || 'Ошибка');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Пользователи</h2>
          <p className="text-sm text-gray-500 mt-0.5">{Object.keys(users).length} аккаунтов</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/15 text-emerald-300 text-sm font-medium hover:bg-emerald-500/25"
        >
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {msg && !showAdd && <p className="text-sm text-amber-400">{msg}</p>}

      {error && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center gap-3">
          <WifiOff className="w-5 h-5 text-amber-400" />
          <span className="text-amber-300 text-sm">{error}</span>
        </div>
      )}

      {showAdd && (
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4 space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Логин" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль (от 6 символов)" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50" />
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50">
            <option value="viewer">Только просмотр</option>
            <option value="admin">Администратор</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-400">Создать</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-sm">Отмена</button>
          </div>
          {msg && <p className="text-sm text-amber-400">{msg}</p>}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><RefreshCw className="w-8 h-8 animate-spin text-emerald-400" /></div>
      ) : (
        <div className="grid gap-2">
          {(Object.entries(users) as Array<[string, { role: string }]>).map(([n, u]) => (
            <div key={n} className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${u.role === 'admin' ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                  {u.role === 'admin' ? <Shield className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{n}</p>
                  <p className="text-xs text-gray-500">{u.role === 'admin' ? 'Администратор' : 'Только просмотр'}</p>
                </div>
              </div>
              <button onClick={() => handleDel(n)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
