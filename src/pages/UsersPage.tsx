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
    <div className="space-y-4 p-4">
      {/* Profile card */}
      <div className="bg-gradient-to-br from-[#21A038] to-[#1a8a2e] rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <UserIcon className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold">admin</h2>
            <p className="text-xs text-white/70">Администратор</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Пользователи</p>
          <p className="text-2xl font-bold mt-0.5">{users.length}</p>
        </div>
        <div className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5">
          <p className="text-[10px] text-[#21A038] uppercase tracking-wider">Онлайн</p>
          <p className="text-2xl font-bold mt-0.5 text-[#21A038]">{users.filter(u => u.status === 'online').length}</p>
        </div>
      </div>

      {/* Add button */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#21A038] text-white text-sm font-medium active:opacity-80"
      >
        <Plus className="w-4 h-4" /> Добавить пользователя
      </button>

      {/* Add form */}
      {showAdd && (
        <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/5 space-y-3">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Логин"
            className="w-full bg-white/5 rounded-xl px-3 py-3 text-sm text-white placeholder-gray-500 border border-white/5 focus:border-[#21A038]/50 outline-none"
          />
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Пароль (мин. 6 символов)"
            className="w-full bg-white/5 rounded-xl px-3 py-3 text-sm text-white placeholder-gray-500 border border-white/5 focus:border-[#21A038]/50 outline-none"
          />
          <select
            value={newRole}
            onChange={e => setNewRole(e.target.value as 'viewer' | 'admin')}
            className="w-full bg-white/5 rounded-xl px-3 py-3 text-sm text-white border border-white/5 focus:border-[#21A038]/50 outline-none"
          >
            <option value="viewer">Только просмотр</option>
            <option value="admin">Администратор</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={addUser}
              className="flex-1 py-3 rounded-xl bg-[#21A038] text-white text-sm font-medium active:opacity-80"
            >
              Создать
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 text-sm font-medium active:bg-white/10"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Users list */}
      <div className="space-y-2">
        {users.map(user => (
          <div key={user.name} className="bg-[#1c1c1e] rounded-2xl p-3 border border-white/5 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
              user.role === 'admin' ? 'bg-amber-500/15' : 'bg-white/5'
            }`}>
              {user.role === 'admin' ? (
                <Shield className="w-5 h-5 text-amber-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">{user.name}</h3>
                {user.status === 'online' && (
                  <div className="w-2 h-2 rounded-full bg-[#21A038]" />
                )}
              </div>
              <p className="text-[11px] text-gray-500">
                {user.role === 'admin' ? 'Администратор' : 'Только просмотр'}
              </p>
            </div>
            {user.name !== 'admin' && (
              <button
                onClick={() => deleteUser(user.name)}
                className="p-2 rounded-xl bg-white/5 active:bg-red-500/20 text-gray-500 active:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/5">
        <p className="text-xs text-gray-400 leading-relaxed">
          <strong className="text-amber-400">Администратор</strong> — полный доступ ко всем функциям.
          <br />
          <strong className="text-gray-300">Просмотр</strong> — только камеры, события и архив.
        </p>
      </div>
    </div>
  );
}
