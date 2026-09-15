import React, { useState } from 'react';
import { AuditResult, ChecklistItem, CheckStatus } from '../types';
import { ShieldCheck, ShieldAlert, ShieldX, Info, Code, ChevronDown, ChevronUp, Lock, Eye, Server, AlertCircle } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

interface ChecklistTabsProps {
  result: AuditResult;
  onSelectFixItem: (item: ChecklistItem) => void;
}

export const ChecklistTabs: React.FC<ChecklistTabsProps> = ({ result, onSelectFixItem }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: 'كافة بنود التدقيق', count: result.totalChecks },
    { key: 'ssl', label: 'بروتوكول HTTPS وتشفير TLS', count: result.categories.ssl.items.length },
    { key: 'headers', label: 'رؤوس الحماية (Security Headers)', count: result.categories.headers.items.length },
    { key: 'privacy', label: 'الخصوصية وملفات التتبع', count: result.categories.privacy.items.length },
    { key: 'network', label: 'أمان الشبكة وسجلات DNSSEC', count: result.categories.network.items.length },
    { key: 'vulnerabilities', label: 'مصفوفة كشف الثغرات والخادم', count: result.categories.vulnerabilities.items.length },
  ];

  let itemsToDisplay: ChecklistItem[] = [];
  if (activeTab === 'all') {
    itemsToDisplay = [
      ...result.categories.ssl.items,
      ...result.categories.headers.items,
      ...result.categories.privacy.items,
      ...result.categories.network.items,
      ...result.categories.vulnerabilities.items
    ];
  } else if (activeTab in result.categories) {
    itemsToDisplay = result.categories[activeTab as keyof typeof result.categories].items;
  }

  const toggleExpand = (id: string) => {
    cyberAudio.playClick();
    setExpandedItemId(prev => prev === id ? null : id);
  };

  const getStatusBadge = (status: CheckStatus) => {
    switch (status) {
      case 'pass':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>آمن ومفعل</span>
          </span>
        );
      case 'warn':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/50 text-amber-300 text-xs font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>تنبيه / تحسين مطلوب</span>
          </span>
        );
      case 'fail':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-bold shadow-[0_0_10px_rgba(244,63,94,0.2)] animate-pulse">
            <ShieldX className="w-3.5 h-3.5 text-rose-400" />
            <span>ثغرة أمنية حرجة</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 text-xs font-bold">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>معلومات فنية</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-[#070e24]/90 border border-cyan-500/30 rounded-xl p-5 sm:p-6 shadow-[0_0_35px_rgba(0,240,255,0.12)] my-6 backdrop-blur-md">
      
      {/* Header with Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4 mb-5">
        <div>
          <h2 className="text-xl font-black text-white font-cyber flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <span>مصفوفة تدقيق بنود الأمان والخصوصية التفصيلية</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            انقر على أي بند للاطلاع على التحليل الأمني المتقدم وتوصيات الإصلاح الفوري
          </p>
        </div>

        <span className="font-mono-tech text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded">
          TOTAL DIRECTIVES: {itemsToDisplay.length}
        </span>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 border-b border-slate-800 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.key}
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setActiveTab(cat.key);
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
              activeTab === cat.key
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>{cat.label}</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono-tech ${
              activeTab === cat.key ? 'bg-cyan-400 text-black font-black' : 'bg-slate-800 text-slate-400'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {itemsToDisplay.map(item => {
          const isExpanded = expandedItemId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-lg border transition-all ${
                isExpanded
                  ? 'border-cyan-400/60 bg-[#09122f] shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                  : 'border-slate-800/80 bg-[#050b1c]/80 hover:border-cyan-500/40 hover:bg-[#070e24]'
              }`}
            >
              {/* Item Summary Row */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                      {item.nameAr}
                    </h3>
                    <span className="font-mono-tech text-xs text-cyan-400/90 font-semibold dir-ltr">
                      [{item.name}]
                    </span>
                    {item.specReference && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400 font-mono-tech">
                        {item.specReference}
                      </span>
                    )}
                  </div>

                  <div className="font-mono-tech text-xs text-slate-400 mt-1 truncate dir-ltr">
                    <span className="text-cyan-400 font-semibold">VALUE:</span> {item.value}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {getStatusBadge(item.status)}
                  <div className="text-slate-400 hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Detailed Breakdown */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-cyan-500/15 bg-slate-950/50 space-y-3 text-xs leading-relaxed">
                  
                  <div>
                    <h4 className="font-bold text-cyan-300 text-xs mb-1">التحليل الأمني والوظيفي:</h4>
                    <p className="text-slate-300">{item.descriptionAr}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-emerald-300 text-xs mb-1">توصيات المعالجة الفورية:</h4>
                    <p className="text-slate-300">{item.recommendationAr}</p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                    <div className="text-[11px] text-slate-400 font-mono-tech">
                      CATEGORY: <span className="text-cyan-400 font-bold uppercase">{item.category}</span>
                    </div>

                    {item.fixSnippet && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          cyberAudio.playClick();
                          onSelectFixItem(item);
                        }}
                        className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white transition-all font-mono-tech flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                      >
                        <Code className="w-3.5 h-3.5 text-cyan-400" />
                        <span>عرض كود التهيئة والإصلاح (View Config Code)</span>
                      </button>
                    )}
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
