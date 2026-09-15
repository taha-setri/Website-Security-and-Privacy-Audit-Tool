import React, { useState } from 'react';
import { ChecklistItem } from '../types';
import { X, Copy, Check, Code, ShieldCheck, Terminal } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

interface FixCodeModalProps {
  item: ChecklistItem | null;
  onClose: () => void;
}

export const FixCodeModal: React.FC<FixCodeModalProps> = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState<'nginx' | 'apache' | 'express' | 'vercel'>('nginx');

  if (!item) return null;

  // Generate platform-specific snippets
  const getCodeSnippet = () => {
    if (item.id === 'ssl-1') {
      if (platform === 'nginx') {
        return `# Nginx Permanent HTTPS Redirect:\nserver {\n    listen 80;\n    server_name example.com;\n    return 301 https://$host$request_uri;\n}`;
      }
      if (platform === 'apache') {
        return `# Apache .htaccess HTTPS Enforcement:\nRewriteEngine On\nRewriteCond %{HTTPS} !=on\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`;
      }
      if (platform === 'express') {
        return `// Express.js HTTPS Redirect Middleware:\napp.use((req, res, next) => {\n  if (req.header('x-forwarded-proto') !== 'https') {\n    return res.redirect('https://' + req.header('host') + req.url);\n  }\n  next();\n});`;
      }
      return `// vercel.json:\n{\n  "redirects": [\n    { "source": "/(.*)", "destination": "https://example.com/$1", "permanent": true }\n  ]\n}`;
    }

    if (item.id === 'hdr-1') {
      if (platform === 'nginx') {
        return `# Nginx Content Security Policy:\nadd_header Content-Security-Policy "default-src 'self'; script-src 'self' https:; object-src 'none'; base-uri 'self';" always;`;
      }
      if (platform === 'apache') {
        return `# Apache .htaccess CSP:\nHeader set Content-Security-Policy "default-src 'self'; script-src 'self' https:; object-src 'none';"`;
      }
      if (platform === 'express') {
        return `// Express helmet / custom CSP:\nimport helmet from 'helmet';\napp.use(helmet.contentSecurityPolicy());`;
      }
      return `// vercel.json:\n{\n  "headers": [{\n    "source": "/(.*)",\n    "headers": [{ "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' https:;" }]\n  }]\n}`;
    }

    if (item.id === 'ssl-3') {
      if (platform === 'nginx') {
        return `# Nginx HSTS Header:\nadd_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;`;
      }
      if (platform === 'apache') {
        return `# Apache HSTS:\nHeader always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"`;
      }
      if (platform === 'express') {
        return `// Express helmet HSTS:\nimport helmet from 'helmet';\napp.use(helmet.hsts({ maxAge: 63072000, includeSubDomains: true, preload: true }));`;
      }
      return `// vercel.json:\n{\n  "headers": [{\n    "source": "/(.*)",\n    "headers": [{ "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }]\n  }]\n}`;
    }

    return item.fixSnippet || `# Recommended Server Header Directive:\nHeader set ${item.name} "${item.value}"`;
  };

  const code = getCodeSnippet();

  const handleCopy = () => {
    cyberAudio.playClick();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#060d24] border border-cyan-500/50 rounded-xl shadow-[0_0_50px_rgba(0,240,255,0.3)] overflow-hidden flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="bg-[#030712] border-b border-cyan-500/30 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" />
            <h3 className="font-cyber font-bold text-sm text-cyan-300">
              دليل تهيئة وإصلاح: {item.nameAr}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-right">
          <div>
            <span className="text-xs text-slate-400 block mb-1">اسم الترويسة القياسي:</span>
            <span className="font-mono-tech text-cyan-400 font-bold text-sm bg-cyan-950/60 px-2 py-1 rounded border border-cyan-500/30 dir-ltr inline-block">
              {item.name}
            </span>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed">
            {item.recommendationAr}
          </p>

          {/* Platform Selector */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-bold">نوع خادم الويب:</span>
            {(['nginx', 'apache', 'express', 'vercel'] as const).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setPlatform(p);
                }}
                className={`px-3 py-1 rounded text-xs font-mono-tech uppercase font-bold border transition-all ${
                  platform === p
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="relative bg-[#020512] border border-cyan-500/30 rounded-lg p-4 font-mono-tech text-xs text-cyan-300 text-left dir-ltr overflow-x-auto shadow-inner">
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] flex items-center gap-1 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>
            <pre className="pr-20 leading-relaxed">{code}</pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#030712] border-t border-cyan-500/20 px-5 py-3 flex justify-end">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] font-cyber"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
