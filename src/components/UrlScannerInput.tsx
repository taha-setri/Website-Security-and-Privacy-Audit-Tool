import React, { useState } from 'react';
import { Search, ShieldAlert, Crosshair, Sparkles, CornerDownLeft } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

interface UrlScannerInputProps {
  onScan: (url: string) => void;
  isScanning: boolean;
}

export const UrlScannerInput: React.FC<UrlScannerInputProps> = ({ onScan, isScanning }) => {
  const [inputUrl, setInputUrl] = useState('https://example.com');

  const presets = [
    { label: 'Google (مثالي A+)', url: 'https://google.com' },
    { label: 'GitHub (مطورين A+)', url: 'https://github.com' },
    { label: 'متجر إلكتروني (نموذج B)', url: 'https://ecommerce-store-sample.io' },
    { label: 'موقع غير مشفر (تحذير F)', url: 'http://insecure-portal.test' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isScanning || !inputUrl.trim()) return;
    cyberAudio.playScanChime();
    onScan(inputUrl.trim());
  };

  const handlePresetSelect = (url: string) => {
    cyberAudio.playClick();
    setInputUrl(url);
    if (!isScanning) {
      cyberAudio.playScanChime();
      onScan(url);
    }
  };

  return (
    <div className="w-full relative bg-[#070e24]/90 border border-cyan-500/30 rounded-xl p-5 sm:p-6 shadow-[0_0_35px_rgba(0,240,255,0.12)] backdrop-blur-md">
      
      {/* Decorative Sci-Fi HUD Corner brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div className="flex items-center justify-between">
          <label htmlFor="target-url-input" className="flex items-center gap-2 text-sm font-bold text-cyan-300">
            <Crosshair className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span>تحديد الهدف وإطلاق مسبار التدقيق الأمني (TARGET URL SPECIFICATION):</span>
          </label>
          <span className="font-mono-tech text-xs text-slate-400 hidden sm:inline">
            PROTOCOL SUPPORT: HTTP / HTTPS / TLS 1.3
          </span>
        </div>

        {/* Input & Action Button Bar */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-cyan-400/70">
              <Search className="w-5 h-5" />
            </div>
            
            <input
              id="target-url-input"
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="أدخل رابط الموقع (مثال: https://mywebsite.com أو domain.com)"
              dir="ltr"
              disabled={isScanning}
              className="w-full bg-[#020617]/90 border border-cyan-500/40 rounded-lg pr-11 pl-4 py-3.5 text-cyan-300 font-mono-tech text-base sm:text-lg tracking-wide placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40 transition-all shadow-inner"
            />
          </div>

          <button
            id="btn-execute-audit"
            type="submit"
            disabled={isScanning}
            className={`relative group overflow-hidden px-7 py-3.5 rounded-lg font-cyber font-bold text-sm sm:text-base tracking-wider flex items-center justify-center gap-3 transition-all duration-300 ${
              isScanning
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 hover:text-black border border-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:shadow-[0_0_35px_rgba(0,240,255,0.8)] active:scale-95'
            }`}
          >
            {/* Shimmer line inside button */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

            <Sparkles className="w-5 h-5 text-slate-900 group-hover:rotate-12 transition-transform" />
            <span>{isScanning ? 'جاري الفحص الميداني...' : 'بدء الفحص السيبراني الشامل'}</span>
            <CornerDownLeft className="w-4 h-4 text-slate-900 hidden sm:inline" />
          </button>
        </div>

        {/* Preset Target Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-cyan-500/15 text-xs">
          <span className="text-slate-400 font-semibold">أهداف اختبار سريعة:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(p.url)}
              disabled={isScanning}
              className="px-2.5 py-1 rounded bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all font-mono-tech flex items-center gap-1"
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>

      </form>
    </div>
  );
};
