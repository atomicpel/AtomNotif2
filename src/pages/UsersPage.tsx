import { useState, useEffect } from 'react';
import { Shield, Eye, Plus, Trash2, User as UserIcon } from 'lucide-react';
import { checkConnection } from '../api';

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
    <div className="p-4 space-y-4">
      {/* Profile card */}
      <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-4 border border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">admin</h2>
            <p className="text-[11px] text-white/60">Администратор</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-2">
        <div className="flex-1 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
          <p className="text-[10px] text-gray-500">Пользователи</p>
          <p className="text-sm font-semibold text-white">{users.length}</p>
        </div>
        <div className="flex-1 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
          <p className="text-[10px] text-emerald-400">Онлайн</p>
          <p className="text-sm font-semibold text-emerald-400">{users.filter(u => u.status === 'online').length}</p>
        </div>
      </div>

      {/* Add button */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-medium active:opacity-80"
      >
        <Plus className="w-3.5 h-3.5" /> Добавить пользователя
      </button>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Логин"
            className="w-full bg-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 border border-white/5 focus:border-indigo-500/50 outline-none"
          />
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Пароль (мин. 6 символов)"
            className="w-full bg-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 border border-white/5 focus:border-indigo-500/50 outline-none"
          />
          <select
            value={newRole}
            onChange={e => setNewRole(e.target.value as 'viewer' | 'admin')}
            className="w-full bg-white/5 rounded-lg px-3 py-2 text-xs text-white border border-white/5 focus:border-indigo-500/50 outline-none"
          >
            <option value="viewer">Только просмотр</option>
            <option value="admin">Администратор</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={addUser}
              className="flex-1 py-2 rounded-lg bg-indigo-500 text-white text-xs font-medium active:opacity-80"
            >
              Создать
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 py-2 rounded-lg bg-white/5 text-gray-400 text-xs font-medium active:bg-white/10 border border-white/5"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Users list */}
      <div className="space-y-2">
        {users.map(user => (
          <div key={user.name} className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              user.role === 'admin' ? 'bg-amber-500/10' : 'bg-white/5'
            }`}>
              {user.role === 'admin' ? (
                <Shield className="w-4 h-4 text-amber-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-semibold text-white">{user.name}</h3>
                {user.status === 'online' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {user.role === 'admin' ? 'Администратор' : 'Только просмотр'}
              </p>
            </div>
            {user.name !== 'admin' && (
              <button
                onClick={() => deleteUser(user.name)}
                className="p-2 rounded-lg bg-white/5 active:bg-red-500/20 text-gray-500 active:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          <strong className="text-amber-400">Администратор</strong> — полный доступ.
          <br />
          <strong className="text-gray-300">Просмотр</strong> — только камеры, события и архив.
        </p>
      </div>
    </div>
  );
}
