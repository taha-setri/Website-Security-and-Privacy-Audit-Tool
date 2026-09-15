import React, { useState, useEffect, useCallback } from 'react';
import { NetworkBar } from './components/NetworkBar';
import { CommandHeader } from './components/CommandHeader';
import { UrlScannerInput } from './components/UrlScannerInput';
import { ScanningAnimation } from './components/ScanningAnimation';
import { ScoreDashboard } from './components/ScoreDashboard';
import { TerminalConsole } from './components/TerminalConsole';
import { ChecklistTabs } from './components/ChecklistTabs';
import { FixCodeModal } from './components/FixCodeModal';
import { Footer } from './components/Footer';
import { AuditResult, ChecklistItem, TerminalLog } from './types';
import { generateAuditResult, generateSimulationLogs } from './utils/securityAuditor';
import { cyberAudio } from './utils/audio';
import { Shield, Sparkles, Terminal, Layers, RefreshCw } from 'lucide-react';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [selectedFixItem, setSelectedFixItem] = useState<ChecklistItem | null>(null);

  // Initialize with a default audit on first load for immediate visual impact
  useEffect(() => {
    const initialResult = generateAuditResult('https://example.com');
    setAuditResult(initialResult);
    setLogs(generateSimulationLogs('example.com'));
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    cyberAudio.enabled = next;
    setSoundEnabled(next);
    if (next) {
      cyberAudio.playClick();
    }
  };

  const executeAudit = useCallback((targetUrl: string) => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setCurrentPhase('تهيئة مجسات الفحص وتوجيه حزم الاستطلاع...');

    // Clear old logs and start initial stream
    const simLogs = generateSimulationLogs(targetUrl);
    setLogs([simLogs[0]]);

    const phases = [
      { p: 20, phase: 'استعلام خوادم DNS الجذرية وفحص سجلات Anycast...', logIdx: 1 },
      { p: 40, phase: 'فحص توقيعات DNSSEC ومصافحة تشفير TLS 1.3...', logIdx: 3 },
      { p: 60, phase: 'استخراج وفحص رؤوس الحماية HTTP Security Headers...', logIdx: 6 },
      { p: 80, phase: 'تدقيق خصوصية ملفات تعريف الارتباط ومستشعرات المتصفح...', logIdx: 9 },
      { p: 100, phase: 'اكتمال تدقيق مصفوفة الأمان وحساب مؤشر التهديد...', logIdx: 11 },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= phases.length) {
        const item = phases[currentStep - 1];
        setScanProgress(item.p);
        setCurrentPhase(item.phase);
        
        // Add simulated logs as we progress
        if (simLogs[item.logIdx]) {
          setLogs(prev => [...prev, simLogs[item.logIdx]]);
        }

        cyberAudio.playBeep(600 + currentStep * 120, 0.04, 'sine');
      } else {
        clearInterval(interval);
        // Complete remaining logs
        setLogs(simLogs);
        const finalAudit = generateAuditResult(targetUrl);
        setAuditResult(finalAudit);
        setIsScanning(false);
        cyberAudio.playSuccess();
      }
    }, 450);
  }, [isScanning]);

  const handleAddLog = (log: TerminalLog) => {
    setLogs(prev => [...prev, log]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans relative">
      
      {/* Background Cyber Matrix Grid */}
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Top Network Bar with requested link */}
      <NetworkBar soundEnabled={soundEnabled} onToggleSound={handleToggleSound} />

      {/* Command Center Sci-Fi Header */}
      <CommandHeader />

      {/* Main Command Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 relative z-10">
        
        {/* URL Target Input */}
        <UrlScannerInput onScan={executeAudit} isScanning={isScanning} />

        {/* Live Scanning Progress Animation */}
        {isScanning && (
          <ScanningAnimation progress={scanProgress} currentPhase={currentPhase} />
        )}

        {/* Audit Score & Telemetry Dashboard */}
        {auditResult && !isScanning && (
          <ScoreDashboard result={auditResult} />
        )}

        {/* Interactive Checklist Tabs (Headers, SSL, Privacy, Network, Vulns) */}
        {auditResult && (
          <ChecklistTabs
            result={auditResult}
            onSelectFixItem={(item) => setSelectedFixItem(item)}
          />
        )}

        {/* Sci-Fi Live Terminal Console */}
        <TerminalConsole
          logs={logs}
          onClear={handleClearLogs}
          onAddLog={handleAddLog}
        />

      </main>

      {/* Cyber Security & Compliance Footer (Founder, Disclaimer, Cookies) */}
      <Footer />

      {/* Code Fix Modal */}
      <FixCodeModal
        item={selectedFixItem}
        onClose={() => setSelectedFixItem(null)}
      />

    </div>
  );
}
