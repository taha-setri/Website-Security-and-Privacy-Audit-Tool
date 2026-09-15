import React from 'react';
import { Loader2, Shield, Radio, Lock, Server, FileCode, CheckCircle2 } from 'lucide-react';

interface ScanningAnimationProps {
  progress: number;
  currentPhase: string;
}

export const ScanningAnimation: React.FC<ScanningAnimationProps> = ({ progress, currentPhase }) => {
  const steps = [
    { label: 'استعلام DNS و Anycast', icon: Server, threshold: 20 },
    { label: 'مصافحة تشفير TLS 1.3', icon: Lock, threshold: 40 },
    { label: 'فحص رؤوس الحماية (CSP/HSTS)', icon: FileCode, threshold: 65 },
    { label: 'تدقيق الخصوصية والتتبع', icon: Radio, threshold: 85 },
    { label: 'حساب مصفوفة المخاطر', icon: Shield, threshold: 100 }
  ];

  return (
    <div className="w-full bg-[#081026]/95 border border-cyan-500/40 rounded-xl p-6 shadow-[0_0_35px_rgba(0,240,255,0.2)] my-6 relative overflow-hidden backdrop-blur-md">
      
      {/* Background Cyber Scanline */}
      <div className="absolute inset-0 cyber-scanlines pointer-events-none opacity-40" />

      <div className="relative z-10 flex flex-col gap-6">
        
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400/20" />
            </div>
            <div>
              <div className="font-cyber text-xs text-cyan-400 tracking-wider">ACTIVE PENETRATION & AUDIT PROBE</div>
              <div className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                <span>{currentPhase}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono-tech">
            <span className="text-slate-400 text-xs">PROGRESS:</span>
            <span className="text-2xl font-black text-cyan-300 font-cyber tracking-widest text-glow-cyan">
              {progress}%
            </span>
          </div>
        </div>

        {/* Glowing Progress Bar */}
        <div className="w-full">
          <div className="h-4 bg-slate-950/80 rounded-full border border-cyan-500/40 p-0.5 relative overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-200 relative"
              style={{ width: `${progress}%` }}
            >
              {/* Glowing Pulse Laser inside bar */}
              <div className="absolute inset-0 animate-cyber-shimmer" />
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full shadow-[0_0_12px_#ffffff]" />
            </div>
          </div>
        </div>

        {/* Step Progression Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {steps.map((step, idx) => {
            const isCompleted = progress >= step.threshold;
            const isCurrent = progress < step.threshold && (idx === 0 || progress >= steps[idx - 1].threshold);
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center text-center p-2.5 rounded-lg border transition-all ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                    : isCurrent
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)] animate-pulse'
                    : 'border-slate-800 bg-slate-900/40 text-slate-500'
                }`}
              >
                <div className="mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-cyan-400 animate-spin-slow' : 'text-slate-500'}`} />
                  )}
                </div>
                <span className="text-[11px] font-semibold leading-tight">{step.label}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
