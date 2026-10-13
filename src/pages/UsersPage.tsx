import { useState, useEffect } from 'react';
import { Shield, Eye, Plus, Trash2, User as UserIcon } from 'lucide-react';
import { API_BASE, checkConnection } from '../api';

interface UserData {
  name: string;
  role: 'admin' | 'viewer';
  status: 'online' | 'offline';
}

const demoUsers: UserData[] = [
  { name: 'admin', role: 'admin', status: 'online' },
  { name: 'wife', role: 'viewer', status: 'online' },
  { name: 'son', role: 'viewer', status: 'offline' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>(demoUsers);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'viewer' | 'admin'>('viewer');
  const [serverConnected, setServerConnected] = useState<boolean | null>(null);

  useEffect(() => {
    checkConnection().then(setServerConnected);
  }, []);

  const addUser = () => {
    if (newName.length >= 2 && newPassword.length >= 6) {
      setUsers([...users, { name: newName, role: newRole, status: 'offline' }]);
      setNewName('');
      setNewPassword('');
      setShowAdd(false);
    }
  };

  const deleteUser = (name: string) => {
    if (name !== 'admin') {
      setUsers(users.filter(u => u.name !== name));
    }
  };

  return (
    <div className="space-y-6 p-5">
      {/* Profile card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 shadow-2xl shadow-purple-500/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">admin</h2>
            <p className="text-sm text-white/70">Администратор</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-4 border border-white/10">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Пользователи</p>
          <p className="text-3xl font-bold mt-2 text-white">{users.length}</p>
        </div>
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-4 border border-white/10">
          <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">Онлайн</p>
          <p className="text-3xl font-bold mt-2 text-emerald-400">{users.filter(u => u.status === 'online').length}</p>
        </div>
      </div>

      {/* Add button */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold active:opacity-80 shadow-lg shadow-indigo-500/50"
      >
        <Plus className="w-5 h-5" /> Добавить пользователя
      </button>

      {/* Add form */}
      {showAdd && (
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-5 border border-white/10 space-y-3">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Логин"
            className="w-full bg-white/5 rounded-2xl px-4 py-4 text-sm text-white placeholder-gray-500 border border-white/10 focus:border-indigo-500/50 outline-none transition-all"
          />
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Пароль (мин. 6 символов)"
            className="w-full bg-white/5 rounded-2xl px-4 py-4 text-sm text-white placeholder-gray-500 border border-white/10 focus:border-indigo-500/50 outline-none transition-all"
          />
          <select
            value={newRole}
            onChange={e => setNewRole(e.target.value as 'viewer' | 'admin')}
            className="w-full bg-white/5 rounded-2xl px-4 py-4 text-sm text-white border border-white/10 focus:border-indigo-500/50 outline-none transition-all"
          >
            <option value="viewer">Только просмотр</option>
            <option value="admin">Администратор</option>
          </select>
          <div className="flex gap-3">
            <button
              onClick={addUser}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold active:opacity-80 shadow-lg shadow-indigo-500/50"
            >
              Создать
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400 text-sm font-bold active:bg-white/10 border border-white/10"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Users list */}
      <div className="space-y-3">
        {users.map(user => (
          <div key={user.name} className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-4 border border-white/10 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              user.role === 'admin' 
                ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30' 
                : 'bg-white/5 border border-white/10'
            }`}>
              {user.role === 'admin' ? (
                <Shield className="w-6 h-6 text-amber-400" />
              ) : (
                <Eye className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{user.name}</h3>
                {user.status === 'online' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {user.role === 'admin' ? 'Администратор' : 'Только просмотр'}
              </p>
            </div>
            {user.name !== 'admin' && (
              <button
                onClick={() => deleteUser(user.name)}
                className="p-3 rounded-2xl bg-white/5 active:bg-red-500/20 text-gray-500 active:text-red-400 border border-white/10 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-5 border border-white/10">
        <p className="text-sm text-gray-400 leading-relaxed">
          <strong className="text-amber-400">Администратор</strong> — полный доступ ко всем функциям.
          <br />
          <strong className="text-gray-300">Просмотр</strong> — только камеры, события и архив.
        </p>
      </div>
    </div>
  );
}
