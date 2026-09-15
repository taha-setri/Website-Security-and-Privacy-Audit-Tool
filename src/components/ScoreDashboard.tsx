import React from 'react';
import { AuditResult } from '../types';
import { Shield, ShieldCheck, ShieldAlert, ShieldX, Globe, Server, Lock, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ScoreDashboardProps {
  result: AuditResult;
}

export const ScoreDashboard: React.FC<ScoreDashboardProps> = ({ result }) => {
  const { overallScore, securityGrade, threatLevel, cleanDomain, ipAddress, serverLocation, tlsVersion, cipherSuite, totalChecks, passedChecks, warnChecks, failedChecks } = result;

  // Grade color theme
  const getTheme = () => {
    if (overallScore >= 90) {
      return {
        text: 'text-emerald-400',
        border: 'border-emerald-500',
        stroke: '#10b981',
        bg: 'bg-emerald-950/40',
        glow: 'shadow-[0_0_30px_rgba(16,185,129,0.35)]',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
        icon: ShieldCheck
      };
    }
    if (overallScore >= 75) {
      return {
        text: 'text-cyan-400',
        border: 'border-cyan-500',
        stroke: '#00f0ff',
        bg: 'bg-cyan-950/40',
        glow: 'shadow-[0_0_30px_rgba(0,240,255,0.35)]',
        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
        icon: Shield
      };
    }
    if (overallScore >= 60) {
      return {
        text: 'text-amber-400',
        border: 'border-amber-500',
        stroke: '#f59e0b',
        bg: 'bg-amber-950/40',
        glow: 'shadow-[0_0_30px_rgba(245,158,11,0.35)]',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        icon: ShieldAlert
      };
    }
    return {
      text: 'text-rose-400',
      border: 'border-rose-500',
      stroke: '#f43f5e',
      bg: 'bg-rose-950/40',
      glow: 'shadow-[0_0_30px_rgba(244,63,94,0.35)]',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
      icon: ShieldX
    };
  };

  const theme = getTheme();
  const Icon = theme.icon;

  // SVG Circular Meter calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 my-6">
      
      {/* Big Holographic Score Ring Card */}
      <div className={`lg:col-span-4 bg-[#070e24]/90 border ${theme.border}/40 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-md ${theme.glow}`}>
        
        {/* Background Radial Glow */}
        <div className="absolute inset-0 cyber-grid-dense opacity-20 pointer-events-none" />

        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-5 h-5 ${theme.text}`} />
          <span className="font-cyber text-xs tracking-widest text-slate-300 uppercase">
            مؤشر الأمان السيبراني
          </span>
        </div>

        {/* Circular SVG Gauge */}
        <div className="relative w-44 h-44 flex items-center justify-center my-2">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Colored Progress Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={theme.stroke}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>

          {/* Centered Score & Grade */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl sm:text-5xl font-black font-cyber ${theme.text} tracking-tight`}>
              {overallScore}
            </span>
            <span className="text-[11px] font-mono-tech text-slate-400">/ 100 PTS</span>
            <div className={`mt-1 font-cyber font-black text-sm px-2.5 py-0.5 rounded border ${theme.badge}`}>
              درجة: {securityGrade}
            </div>
          </div>
        </div>

        {/* Threat Level Badge */}
        <div className="mt-3 flex flex-col items-center gap-1">
          <span className="text-xs text-slate-400">مستوى الخطورة والتهديد:</span>
          <span className={`font-cyber text-xs font-bold px-3 py-1 rounded-full border ${theme.badge} uppercase tracking-wider`}>
            {threatLevel === 'SECURE' ? 'مؤمن بالكامل (SECURE)' :
             threatLevel === 'LOW' ? 'منخفض المخاطر (LOW THREAT)' :
             threatLevel === 'MODERATE' ? 'متوسط المخاطر (MODERATE)' :
             threatLevel === 'ELEVATED' ? 'مرتفع المخاطر (ELEVATED)' :
             'حرج جداً - غير آمن (CRITICAL)'}
          </span>
        </div>
      </div>

      {/* Right Column: Telemetry Specs & Quick Check Breakdown */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* Top 4 Telemetry Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          <div className="bg-[#081026]/90 border border-cyan-500/25 rounded-lg p-3.5 flex items-start gap-3">
            <div className="p-2 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-slate-400 font-mono-tech block">نطاق الهدف المستعلم</span>
              <span className="text-sm font-bold text-white font-mono-tech truncate block" title={cleanDomain}>
                {cleanDomain}
              </span>
              <span className="text-[11px] text-cyan-400 font-mono-tech">
                استجابة الخادم: {result.responseTimeMs}ms
              </span>
            </div>
          </div>

          <div className="bg-[#081026]/90 border border-cyan-500/25 rounded-lg p-3.5 flex items-start gap-3">
            <div className="p-2 rounded bg-purple-950/60 border border-purple-500/30 text-purple-400">
              <Server className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-slate-400 font-mono-tech block">عنوان الخادم والموقع (IP/Geo)</span>
              <span className="text-sm font-bold text-white font-mono-tech truncate block">
                {ipAddress}
              </span>
              <span className="text-[11px] text-purple-300 font-mono-tech">
                {serverLocation}
              </span>
            </div>
          </div>

          <div className="bg-[#081026]/90 border border-cyan-500/25 rounded-lg p-3.5 flex items-start gap-3">
            <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-slate-400 font-mono-tech block">بروتوكول التشفير الفعال</span>
              <span className="text-sm font-bold text-emerald-300 font-mono-tech truncate block">
                {tlsVersion}
              </span>
              <span className="text-[10px] text-slate-400 font-mono-tech truncate block" title={cipherSuite}>
                {cipherSuite}
              </span>
            </div>
          </div>

          <div className="bg-[#081026]/90 border border-cyan-500/25 rounded-lg p-3.5 flex items-start gap-3">
            <div className="p-2 rounded bg-blue-950/60 border border-blue-500/30 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-slate-400 font-mono-tech block">صلاحية شهادة الأمان (SSL Cert)</span>
              <span className="text-sm font-bold text-white font-mono-tech block">
                {result.certExpiryDays > 0 ? `${result.certExpiryDays} يوماً متبقية` : 'منتهية الصلاحية'}
              </span>
              <span className="text-[11px] text-blue-300 font-mono-tech truncate block" title={result.certIssuer}>
                {result.certIssuer}
              </span>
            </div>
          </div>

        </div>

        {/* Check Status Counter Bar */}
        <div className="bg-[#081026]/90 border border-cyan-500/25 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-bold">ملخص نتائج الاختبارات الأمنية ({totalChecks} فحص):</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-tech">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>اجتياز: <strong>{passedChecks}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>تحذيرات: <strong>{warnChecks}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>ثغرات حرجة: <strong>{failedChecks}</strong></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
