import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw, ScrollText } from 'lucide-react';
import { getLogs } from '../api';

type LevelFilter = '' | 'warning' | 'error';

export default function LogsPage() {
  const [lines, setLines] = useState<string[]>([]);
  const [level, setLevel] = useState<LevelFilter>('');
  const [auto, setAuto] = useState(true);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const preRef = useRef<HTMLPreElement>(null);
  const stickBottom = useRef(true);

  const load = useCallback(async () => {
    try {
      setErr('');
      const data = await getLogs(400, level || undefined);
      setLines(data.lines || []);
      setLoading(false);
    } catch (e: any) {
      setErr(e?.message === 'forbidden' ? 'Нужны права администратора' : 'Не удалось загрузить журнал');
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [auto, load]);

  useEffect(() => {
    if (stickBottom.current && preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [lines]);

  const colorLine = (line: string) => {
    if (line.includes(' ERROR') || line.includes('  ERROR')) return 'text-red-400';
    if (line.includes(' WARNING') || line.includes('  WARNING')) return 'text-amber-400';
    if (line.includes(' INFO')) return 'text-gray-400';
    return 'text-gray-500';
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-7rem)] lg:h-[calc(100dvh-2rem)]">
      <div className="flex flex-wrap items-center gap-2 mb-3 shrink-0">
        <div className="flex items-center gap-2 mr-auto">
          <ScrollText className="w-5 h-5 text-emerald-400" />
          <h1 className="text-lg font-semibold">Журнал</h1>
        </div>
        <select
          value={level}
          onChange={e => setLevel(e.target.value as LevelFilter)}
          className="rounded-xl bg-white/[0.06] border border-white/[0.08] px-3 py-2 text-sm"
        >
          <option value="">Все уровни</option>
          <option value="warning">Предупреждения и ошибки</option>
          <option value="error">Только ошибки</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-400 px-1">
          <input type="checkbox" checked={auto} onChange={e => setAuto(e.target.checked)} className="rounded" />
          авто 5с
        </label>
        <button
          onClick={() => load()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08] px-3 py-2 text-sm hover:bg-white/[0.1]"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Обновить
        </button>
      </div>

      {err && (
        <div className="mb-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-3 py-2">
          {err}
        </div>
      )}

      <pre
        ref={preRef}
        onScroll={e => {
          const el = e.currentTarget;
          stickBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
        className="flex-1 min-h-0 overflow-auto rounded-2xl bg-[#0d0d14] border border-white/[0.06] p-3 text-[11px] sm:text-xs leading-relaxed font-mono"
      >
        {lines.length === 0 && !loading && (
          <span className="text-gray-600">Журнал пуст</span>
        )}
        {lines.map((line, i) => (
          <div key={i} className={`${colorLine(line)} break-all whitespace-pre-wrap`}>
            {line}
          </div>
        ))}
      </pre>
      <p className="text-[11px] text-gray-600 mt-2 shrink-0">
        Файл cctv.log на сервере · {lines.length} строк · только для администратора
      </p>
    </div>
  );
}
