import React, { useRef, useEffect } from 'react';
import { Shield, ShieldCheck, Terminal, Cpu, Zap, Activity } from 'lucide-react';

export const CommandHeader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render authentic interactive radar sweeping canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    let animId: number;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 4;

    // Simulated blips on radar
    const blips = [
      { r: 28, a: 1.2, size: 2.5, alpha: 0.8 },
      { r: 48, a: 3.4, size: 3, alpha: 0.6 },
      { r: 62, a: 5.1, size: 2, alpha: 0.9 }
    ];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Radar rings
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
      ctx.lineWidth = 1;
      [radius * 0.33, radius * 0.66, radius].forEach(r => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX, 2);
      ctx.lineTo(centerX, height - 2);
      ctx.moveTo(2, centerY);
      ctx.lineTo(width - 2, centerY);
      ctx.stroke();

      // Sweep gradient line
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, 0, Math.PI / 4);
      ctx.lineTo(0, 0);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius, 0);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Blips
      blips.forEach(b => {
        const bx = centerX + Math.cos(b.a) * b.r;
        const by = centerY + Math.sin(b.a) * b.r;
        ctx.beginPath();
        ctx.arc(bx, by, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${b.alpha})`;
        ctx.fill();
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 6;
      });

      angle += 0.035;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <header className="relative border-b border-cyan-500/20 bg-gradient-to-b from-[#060c20] via-[#040816] to-[#030712] py-8 px-4 sm:px-6 overflow-hidden">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-0 right-1/4 w-96 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-36 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Title & Core Concept */}
        <div className="flex items-center gap-4 text-right">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl border border-cyan-400/40 bg-cyan-950/40 flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.3)]">
              <ShieldCheck className="w-9 h-9 text-cyan-400 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -left-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full shadow-[0_0_8px_#10b981]" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-cyber text-xs tracking-widest text-cyan-400 uppercase bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                CYBER-DEFENSE PROTOCOL
              </span>
              <span className="font-mono-tech text-xs text-slate-400">BUILD 9.4.1</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-white via-cyan-100 to-cyan-400 text-glow-cyan">
                أداة تدقيق أمان وخصوصية المواقع
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 max-w-xl">
              غرفة قيادة أمنية متقدمة لفحص بروتوكول HTTPS المشفر، تقييم ترويسات الحماية، تدقيق ملفات التتبع، واكتشاف ثغرات الاستهداف السيبراني.
            </p>
          </div>
        </div>

        {/* Right / Center: Holographic Radar HUD Widget */}
        <div className="flex items-center gap-5 bg-slate-950/70 border border-cyan-500/30 rounded-lg p-3 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={100}
              height={100}
              className="rounded-full border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-mono-tech text-cyan-400/80 font-bold">RADAR</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 font-mono-tech text-xs min-w-[170px]">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>DEFENSE GRID:</span>
              </span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-400" />
                <span>PACKET ENGINE:</span>
              </span>
              <span className="text-cyan-400">QUANTUM 1.3</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>SHIELD COEFF:</span>
              </span>
              <span className="text-emerald-300 font-bold">99.8%</span>
            </div>

            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-4/5 animate-pulse" />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
