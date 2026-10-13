import { useState, useEffect } from 'react';
import { Shield, Eye, Plus, Trash2, Key, ExternalLink, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import { API_BASE, checkConnection, getSettingsPageUrl } from '../api';

interface UserData {
  name: string;
  role: 'admin' | 'viewer';
  lastActive: string;
  status: 'online' | 'offline';
}

const initialUsers: UserData[] = [
  { name: 'admin', role: 'admin', lastActive: 'Сейчас', status: 'online' },
  { name: 'wife', role: 'viewer', lastActive: '5 мин назад', status: 'online' },
  { name: 'son', role: 'viewer', lastActive: '2 часа назад', status: 'offline' },
  { name: 'neighbor', role: 'viewer', lastActive: '1 день назад', status: 'offline' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'viewer' | 'admin'>('viewer');
  const [serverConnected, setServerConnected] = useState<boolean | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    checkConnection().then(connected => {
      setServerConnected(connected);
    });
  }, []);

  const addUser = async () => {
    if (newName.length < 2 || newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Имя: 2-32 символа, пароль: минимум 6 символов' });
      return;
    }

    if (serverConnected) {
      try {
        const formData = new FormData();
        formData.append('name', newName);
        formData.append('password', newPassword);
        formData.append('role', newRole);

        const response = await fetch(`${API_BASE}/users/add`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (response.ok) {
          setUsers([...users, { name: newName, role: newRole, lastActive: 'Только что', status: 'offline' }]);
          setNewName('');
          setNewPassword('');
          setShowAdd(false);
          setMessage({ type: 'success', text: `Пользователь ${newName} создан на сервере` });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ type: 'error', text: 'Ошибка при создании пользователя' });
        }
      } catch {
        setMessage({ type: 'error', text: 'Ошибка соединения с сервером' });
      }
    } else {
      // Демо-режим
      setUsers([...users, { name: newName, role: newRole, lastActive: 'Только что', status: 'offline' }]);
      setNewName('');
      setNewPassword('');
      setShowAdd(false);
      setMessage({ type: 'success', text: `Пользователь ${newName} добавлен (демо-режим)` });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const deleteUser = async (name: string) => {
    if (name === 'admin') return;

    if (serverConnected) {
      try {
        const response = await fetch(`${API_BASE}/users/del/${encodeURIComponent(name)}`, {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          setUsers(users.filter(u => u.name !== name));
          setMessage({ type: 'success', text: `Пользователь ${name} удалён с сервера` });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ type: 'error', text: 'Ошибка при удалении' });
        }
      } catch {
        setMessage({ type: 'error', text: 'Ошибка соединения с сервером' });
      }
    } else {
      setUsers(users.filter(u => u.name !== name));
      setMessage({ type: 'success', text: `Пользователь ${name} удалён (демо-режим)` });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Server status */}
      {serverConnected === false && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-amber-400" />
            <div className="flex-1">
              <p className="text-xs text-amber-400">
                Сервер недоступен — изменения не будут сохранены на сервере. Работает демо-режим.
              </p>
            </div>
            <a
              href={API_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/30 transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3 h-3" /> Открыть сервер
            </a>
          </div>
        </div>
      )}

      {/* Messages */}
      {message && (
        <div className={`rounded-xl p-3 flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20'
            : 'bg-red-500/10 border border-red-500/20'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-xs ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
            {message.text}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Пользователи</h2>
          <p className="text-sm text-gray-500 mt-1">
            Управление доступом к системе
            {serverConnected && <span className="text-emerald-400"> • подключено к серверу</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {serverConnected && (
            <a
              href={getSettingsPageUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#161b22] border border-gray-800 text-xs text-gray-400 hover:text-gray-200 hover:border-gray-700 transition"
            >
              <ExternalLink className="w-3 h-3" /> На сервере
            </a>
          )}
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition border border-emerald-500/20"
          >
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>
      </div>

      {/* Add user form */}
      {showAdd && (
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-5">
          <h3 className="text-sm font-medium mb-4">Новый пользователь</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Логин</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Логин (2-32 символа)"
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Пароль</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Роль</label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value as 'viewer' | 'admin')}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="viewer">Только просмотр</option>
                <option value="admin">Администратор</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={addUser}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition"
              >
                Создать
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-400 text-sm font-medium hover:bg-gray-700 transition"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Всего пользователей</p>
          <p className="text-2xl font-bold mt-1">{users.length}</p>
        </div>
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Администраторы</p>
          <p className="text-2xl font-bold mt-1 text-amber-400">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Онлайн</p>
          <p className="text-2xl font-bold mt-1 text-emerald-400">{users.filter(u => u.status === 'online').length}</p>
        </div>
      </div>

      {/* Users list */}
      <div className="space-y-3">
        {users.map(user => (
          <div key={user.name} className="bg-[#161b22] rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  user.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}>
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{user.name}</h3>
                    {user.status === 'online' && (
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      user.role === 'admin'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-gray-800 text-gray-400 border-gray-700'
                    }`}>
                      {user.role === 'admin' ? <Shield className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                      {user.role === 'admin' ? 'Администратор' : 'Просмотр'}
                    </span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-500">{user.lastActive}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition">
                  <Key className="w-4 h-4" />
                </button>
                {user.name !== 'admin' && (
                  <button
                    onClick={() => deleteUser(user.name)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-[#161b22] rounded-xl border border-gray-800 p-4">
        <p className="text-xs text-gray-500">
          <strong className="text-gray-400">Администратор</strong> — полный доступ: камеры, события, архив, настройки, управление пользователями.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          <strong className="text-gray-400">Только просмотр</strong> — доступ к камерам, событиям и архиву без возможности изменения настроек.
        </p>
      </div>
    </div>
  );
}
