import React, { useState, useRef, useEffect } from 'react';
import { TerminalLog } from '../types';
import { Terminal, Copy, Trash2, ShieldAlert, Check, Filter } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

interface TerminalConsoleProps {
  logs: TerminalLog[];
  onClear: () => void;
  onAddLog: (log: TerminalLog) => void;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({ logs, onClear, onAddLog }) => {
  const [filter, setFilter] = useState<'ALL' | 'INFO' | 'SUCCESS' | 'WARN' | 'DANGER'>('ALL');
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter(log => {
    if (filter === 'ALL') return true;
    return log.level === filter;
  });

  const handleCopyLogs = () => {
    cyberAudio.playClick();
    const text = logs.map(l => `[${l.timestamp}] [${l.level}] [${l.tag}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateAttack = () => {
    cyberAudio.playAlert();
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    
    onAddLog({
      id: `sim-${Date.now()}-1`,
      timestamp: timeStr,
      level: 'WARN',
      tag: 'FIREWALL_ALERT',
      text: 'رصد محاولة اختراق وهمية: فحص هجوم حقن Cross-Site Scripting (XSS Vector: <script>alert(1)</script>)...'
    });

    setTimeout(() => {
      onAddLog({
        id: `sim-${Date.now()}-2`,
        timestamp: new Date().toTimeString().split(' ')[0] + '.' + String(new Date().getMilliseconds()).padStart(3, '0'),
        level: 'SUCCESS',
        tag: 'WAF_INTERCEPT',
        text: 'تم صد الهجوم بنجاح عبر ترويسة Content-Security-Policy وحظر الكود المنفذ في البيئة المعزولة!'
      });
    }, 800);
  };

  return (
    <div className="w-full bg-[#020617]/95 border border-cyan-500/35 rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.12)] overflow-hidden flex flex-col font-mono-tech my-6 backdrop-blur-md">
      
      {/* Terminal Title Bar */}
      <div className="bg-[#050c20] border-b border-cyan-500/25 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Terminal Window Dots */}
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block shadow-[0_0_6px_#f43f5e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block shadow-[0_0_6px_#f59e0b]" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block shadow-[0_0_6px_#10b981]" />
          </div>

          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-cyber text-xs text-cyan-300 font-bold tracking-wider">
            سجل الطرفية المباشر // TERMINAL LOG STREAM
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
            BUFFER: {logs.length}
          </span>
        </div>

        {/* Terminal Controls */}
        <div className="flex items-center gap-1.5 text-xs">
          
          {/* Filter Dropdown / Chips */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900/80 p-0.5 rounded border border-slate-800">
            {(['ALL', 'INFO', 'SUCCESS', 'WARN', 'DANGER'] as const).map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setFilter(lvl);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  filter === lvl
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Simulate Attack Test */}
          <button
            type="button"
            onClick={handleSimulateAttack}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-rose-300 text-[11px] transition-all"
            title="إرسال حزمة فحص اختراق وهمية لاختبار استجابة الجدار الناري"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">محاكاة صد هجوم</span>
          </button>

          {/* Copy Logs */}
          <button
            type="button"
            onClick={handleCopyLogs}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] transition-all"
            title="نسخ السجل إلى الحافظة"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>

          {/* Clear Logs */}
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              onClear();
            }}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 transition-all"
            title="مسح الطرفية"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Content Stream */}
      <div
        ref={scrollRef}
        className="p-4 h-64 overflow-y-auto space-y-1.5 text-xs select-text text-left dir-ltr bg-[#01040f]"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 text-center py-10 font-mono-tech">
            &gt;&gt; NO LOG RECORDS MATCH CURRENT BUFFER FILTER &lt;&lt;
          </div>
        ) : (
          filteredLogs.map(log => {
            const levelColor =
              log.level === 'SUCCESS' ? 'text-emerald-400' :
              log.level === 'WARN' ? 'text-amber-400' :
              log.level === 'DANGER' ? 'text-rose-400' :
              log.level === 'TRACE' ? 'text-purple-400' :
              'text-cyan-400';

            const badgeBg =
              log.level === 'SUCCESS' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' :
              log.level === 'WARN' ? 'bg-amber-950/40 text-amber-300 border-amber-500/30' :
              log.level === 'DANGER' ? 'bg-rose-950/40 text-rose-300 border-rose-500/30' :
              log.level === 'TRACE' ? 'bg-purple-950/40 text-purple-300 border-purple-500/30' :
              'bg-cyan-950/40 text-cyan-300 border-cyan-500/30';

            return (
              <div key={log.id} className="flex items-start gap-2 hover:bg-cyan-950/10 px-1 py-0.5 rounded">
                <span className="text-slate-500 text-[11px] select-none shrink-0 font-mono">[{log.timestamp}]</span>
                <span className={`text-[10px] px-1.5 rounded border font-bold shrink-0 ${badgeBg}`}>
                  {log.tag}
                </span>
                <span className={`flex-1 leading-relaxed ${levelColor}`}>
                  {log.text}
                </span>
              </div>
            );
          })
        )}

        {/* Flashing Command Prompt Line */}
        <div className="flex items-center gap-2 text-cyan-500 pt-1">
          <span className="text-cyan-400 select-none">&gt;&gt;</span>
          <span className="text-slate-400 text-[11px]">SENTINEL_DAEMON_LISTENING...</span>
          <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block" />
        </div>
      </div>

    </div>
  );
};
