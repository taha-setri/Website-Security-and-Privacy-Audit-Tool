import React, { useState, useEffect } from 'react';
import { Globe, ArrowUpRight, Volume2, VolumeX, Radio, ShieldCheck } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

interface NetworkBarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const NetworkBar: React.FC<NetworkBarProps> = ({ soundEnabled, onToggleSound }) => {
  const [timeStr, setTimeStr] = useState('');
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Subtle random latency jitter for authentic cyber telemetry feel
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.min(48, Math.max(16, prev + Math.floor((Math.random() - 0.5) * 6))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#030712]/95 border-b border-cyan-500/30 backdrop-blur-md sticky top-0 z-50 px-3 sm:px-6 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left / Start: Network Telemetry & Node */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-cyan-950/40 border border-cyan-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            </span>
            <span className="font-cyber font-semibold text-cyan-400 tracking-wider">CYBER-GRID // V3.8</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 font-mono-tech">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>NODE: SEC-CENTRAL</span>
            <span className="text-cyan-500/50">|</span>
            <span>LATENCY: <strong className="text-emerald-400 font-semibold">{latency}ms</strong></span>
          </div>
        </div>

        {/* Center / Highlighted: The Requested Link to Previous Tool */}
        <div className="order-last md:order-none w-full md:w-auto flex justify-center">
          <a
            id="network-prev-tool-link"
            href="https://local-file-and-text-conversion-tool.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberAudio.playClick()}
            className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded border border-cyan-400/40 bg-gradient-to-r from-cyan-950/70 via-blue-950/60 to-purple-950/70 hover:from-cyan-900/80 hover:to-blue-900/80 text-cyan-300 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:shadow-[0_0_22px_rgba(0,240,255,0.4)]"
            title="الانتقال إلى الأداة السابقة: محول النصوص والملفات المحلية"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
            <span className="font-bold tracking-normal text-[11px] sm:text-xs">
              الانتقال إلى الأداة السابقة: محول النصوص والملفات المحلية
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Right / End: Time, Sound FX, Export Single HTML */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono-tech">
          <div className="hidden lg:flex items-center gap-1 text-slate-400 text-[11px] bg-slate-900/70 px-2 py-1 rounded border border-slate-800">
            <span className="text-cyan-400 font-cyber">ZULU_TIME:</span>
            <span className="text-slate-200">{timeStr}</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            type="button"
            onClick={onToggleSound}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-all ${
              soundEnabled
                ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'border-slate-800 bg-slate-900/40 text-slate-500'
            }`}
            title={soundEnabled ? 'تعطيل المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية السيبرانية'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[11px] hidden sm:inline">{soundEnabled ? 'الصوت: نشط' : 'الصوت: صامت'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
