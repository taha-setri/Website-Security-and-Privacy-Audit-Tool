import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Cookie, 
  UserCheck, 
  Scale, 
  CheckCircle2, 
  ExternalLink, 
  Lock, 
  Info, 
  X, 
  ShieldCheck,
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { cyberAudio } from '../utils/audio';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'disclaimer' | 'cookies' | null>(null);

  const openModal = (type: 'disclaimer' | 'cookies') => {
    cyberAudio.playClick();
    setModalType(type);
  };

  const closeModal = () => {
    cyberAudio.playClick();
    setModalType(null);
  };

  return (
    <footer id="app-footer" className="w-full bg-[#020617] border-t border-cyan-500/20 pt-10 pb-8 px-4 sm:px-6 relative z-20 font-mono-tech text-xs">
      
      {/* Background cyber grid accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,240,255,0.04),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative">
        
        {/* Top Tier: 3 Main Cards (Founder, Disclaimer, Cookies) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* 1. Founder Card: Taha setri */}
          <div 
            id="card-founder-info"
            className="p-5 rounded-xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/30 to-[#030712]/80 shadow-[0_0_20px_rgba(0,240,255,0.06)] hover:border-cyan-400/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-cyan-400">
                <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-400/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                  <UserCheck className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <span className="text-[10px] text-cyan-400/70 block uppercase tracking-widest">Architect & Leadership</span>
                  <h4 className="font-cyber font-bold text-sm text-white">إسم المؤسس // FOUNDER</h4>
                </div>
              </div>

              <div className="bg-slate-900/80 rounded-lg p-3.5 border border-cyan-500/20 my-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">المؤسس والمطور:</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-cyber font-bold tracking-wider">
                    VERIFIED
                  </span>
                </div>
                <div className="text-cyan-300 font-cyber font-bold text-lg mt-1 tracking-wide text-right">
                  Taha setri
                </div>
                <div className="text-slate-400 text-[11px] mt-1 text-right">
                  طه ستري — مطور الأنظمة وهندسة الأمان السيبراني
                </div>
              </div>

              <p className="text-slate-400 text-[11px] leading-relaxed text-right">
                تم تأسيس وبناء هذه المنظومة تحت إشراف وتصميم المؤسس <strong className="text-cyan-300">Taha setri</strong> لتوفير تدقيق أمني فوري ومجاني لمواقع الويب وفق المعايير الدولية.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>LEAD ARCHITECT</span>
              <span className="text-cyan-400 font-bold">TAHA SETRI</span>
            </div>
          </div>

          {/* 2. Disclaimer Card: إخلاء المسؤولية */}
          <div 
            id="card-disclaimer-info"
            className="p-5 rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-[#030712]/80 shadow-[0_0_20px_rgba(245,158,11,0.06)] hover:border-amber-400/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-amber-400">
                <div className="p-2 rounded-lg bg-amber-950/70 border border-amber-400/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  <Scale className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <span className="text-[10px] text-amber-400/70 block uppercase tracking-widest">Legal Notice</span>
                  <h4 className="font-cyber font-bold text-sm text-white">إخلاء المسؤولية // DISCLAIMER</h4>
                </div>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed text-right mb-3">
                تُقدَّم هذه الأداة لأغراض الفحص والتدقيق الاسترشادي والتوعية الأمنية. لا تغني التقارير والدرجات الصادرة عن اختبارات الاختراق الشاملة (Penetration Testing) أو التدقيق الجنائي الميداني.
              </p>

              <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/20 text-[11px] text-amber-200/90 text-right leading-relaxed">
                لا يتحمل المؤسس <strong>Taha setri</strong> أو المنظومة أي مسؤولية قانونية أو مدنية عن أي استخدام غير مشروع أو أضرار ناتجة عن الاعتماد الحصري على النتائج.
              </div>
            </div>

            <button
              type="button"
              id="btn-open-disclaimer-modal"
              onClick={() => openModal('disclaimer')}
              className="mt-4 w-full py-2 px-3 rounded-lg border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Info className="w-3.5 h-3.5" />
              <span>قراءة بيان إخلاء المسؤولية القانوني بالكامل</span>
            </button>
          </div>

          {/* 3. Cookies Policy Card: الكوكيز */}
          <div 
            id="card-cookies-info"
            className="p-5 rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-[#030712]/80 shadow-[0_0_20px_rgba(16,185,129,0.06)] hover:border-emerald-400/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-emerald-400">
                <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-400/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <Cookie className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400/70 block uppercase tracking-widest">Privacy & Tracking</span>
                  <h4 className="font-cyber font-bold text-sm text-white">الكوكيز والخصوصية // COOKIES</h4>
                </div>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed text-right mb-3">
                نحن نحترم خصوصيتك الرقمية بشكل مطلق. لا نستخدم أي ملفات تعريف ارتباط (Cookies) لأطراف ثالثة أو تتبع إعلاني أو جمع للهوية.
              </p>

              <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-200/90 text-right space-y-1">
                <div className="flex items-center gap-1.5 justify-end">
                  <span>كوكيز تتبعية لطرف ثالث: <strong>غير موجودة (صفر كوكيز تتبع)</strong></span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <span>تخزين التفضيلات محلياً (LocalStorage) فقط: <strong>نشط وآمن</strong></span>
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
              </div>
            </div>

            <button
              type="button"
              id="btn-open-cookies-modal"
              onClick={() => openModal('cookies')}
              className="mt-4 w-full py-2 px-3 rounded-lg border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>تفاصيل سياسة ملفات تعريف الارتباط والخصوصية</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar: Links, Protocols, and Copyright */}
        <div className="pt-6 border-t border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block shadow-[0_0_6px_#00f0ff]" />
              <span className="text-white font-cyber font-bold">CYBER-SENTINEL DEFENSE MATRIX</span>
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="text-cyan-300">
              المؤسس: <strong>Taha setri</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <a
              id="footer-prev-tool-link"
              href="https://local-file-and-text-conversion-tool.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => cyberAudio.playClick()}
              className="text-cyan-400 hover:text-cyan-200 underline decoration-cyan-500/50 hover:decoration-cyan-400 transition-all flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>الأداة السابقة: محول النصوص والملفات المحلية</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <span className="text-slate-700">|</span>
            <span className="text-slate-500">TLS 1.3 / CSP L3 / ZERO-TRACKING</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500">© 2026 Taha setri. All Rights Reserved.</span>
          </div>

        </div>

      </div>

      {/* Modal Dialog for Disclaimer or Cookies */}
      {modalType && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div 
            className="w-full max-w-2xl bg-[#030712] border border-cyan-500/40 rounded-xl p-6 shadow-[0_0_40px_rgba(0,240,255,0.2)] text-right font-sans relative"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-4">
              <div className="flex items-center gap-2.5">
                {modalType === 'disclaimer' ? (
                  <div className="p-2 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400">
                    <Scale className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                    <Cookie className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="font-cyber font-bold text-lg text-white">
                    {modalType === 'disclaimer' ? 'بيان إخلاء المسؤولية القانوني والأمني' : 'سياسة الكوكيز والخصوصية والأمان'}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono-tech">
                    المؤسس والمسؤول التقني: Taha setri
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-white transition-all"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {modalType === 'disclaimer' ? (
                <>
                  <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-200">
                    <strong>إشعار قانوني صريح:</strong> تم تصميم وتطوير هذه المنظومة (CYBER-SENTINEL) بواسطة المؤسس <strong>Taha setri</strong> بغرض توفير أداة تقييم أمني وفحص خصوصية استرشادي وسريع للمواقع الإلكترونية وتسهيل اكتشاف الثغرات في إعدادات الخوادم ورؤوس الأمان.
                  </div>

                  <h4 className="font-bold text-white text-sm">1. حدود نطاق الفحص والتقييم:</h4>
                  <p className="text-slate-400">
                    يقوم هذا النظام بفحص الرؤوس التقنية HTTP Headers، وبروتوكولات تشفير شهادات الأمان SSL/TLS، وسياسات حماية المحتوى CSP، وسجلات DNS العامة المتاحة للجمهور. نتائج الفحص لا تعني بأي شكل من الأشكال خلو الموقع تماماً من الثغرات البرمجية في منطق التطبيق (Business Logic) أو قواعد البيانات (SQLi / RCE)، ولا تعد بديلاً عن اختبارات الاختراق الشاملة والمعتمدة.
                  </p>

                  <h4 className="font-bold text-white text-sm">2. إخلاء المسؤولية القانونية:</h4>
                  <p className="text-slate-400">
                    لا يتحمل المؤسس <strong>Taha setri</strong> أو أي جهة مرتبطة بهذه المنظومة أي مسؤولية قانونية، مدنية، أو جنائية عن أي أضرار مادية، تقنية، أو انقطاع في الخدمة قد ينتج عن سوء استخدام الأداة أو الاستناد غير الدقيق لتقاريرها دون استشارة خبراء أمن سيبراني معتمدين.
                  </p>

                  <h4 className="font-bold text-white text-sm">3. الاستخدام المشروع والأخلاقي:</h4>
                  <p className="text-slate-400">
                    يُسمح باستخدام المنظومة فقط لفحص المواقع التي تمتلك إذناً رسمياً بفحصها أو تلك المتاحة للعامة بشكل مشروع. يُحظر استخدام التقارير أو النماذج بأي شكل يخل بأمن الأنظمة أو الخوادم المستهدفة.
                  </p>
                </>
              ) : (
                <>
                  <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                    <strong>شفافية الخصوصية الكاملة:</strong> نحن نؤمن بأن الأداة الأمنية يجب أن تكون قدوة في حماية خصوصية المستخدم. نظام CYBER-SENTINEL لا يقوم بتسجيل أي كوكيز تتبع لطرف ثالث ولا يتصل بأي شبكات إعلانية.
                  </div>

                  <h4 className="font-bold text-white text-sm">1. ما هي ملفات تعريف الارتباط التي نستخدمها؟</h4>
                  <p className="text-slate-400">
                    النظام لا يزرع أي كوكيز تقليدية على متصفحك. نحن نعتمد فقط على التخزين المحلي للمتصفح (<code className="text-cyan-300 font-mono-tech">localStorage</code>) لحفظ التفضيلات التشغيلية المباشرة التالية:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-400 pr-2">
                    <li>حالة المؤثرات الصوتية (تشغيل أو كتم الصوت).</li>
                    <li>سجل الفحص المؤقت والنتائج أثناء جلستك الحالية فقط.</li>
                  </ul>

                  <h4 className="font-bold text-white text-sm">2. حماية الروابط والبيانات المفحوصة:</h4>
                  <p className="text-slate-400">
                    الروابط التي تقوم بإدخالها لفحص أمانها يتم معالجتها وفحص مؤشراتها الأمنية دون تخزين أي هوية شخصية أو ربطها بعنوان IP الخاص بك في أي قاعدة بيانات تجارية.
                  </p>

                  <h4 className="font-bold text-white text-sm">3. الالتزام بالمعايير العالمية:</h4>
                  <p className="text-slate-400">
                    تتوافق معايير الخصوصية في المنظومة تحت إشراف المؤسس <strong>Taha setri</strong> مع مبادئ اللائحة العامة لحماية البيانات (GDPR) وأفضل ممارسات أمان متصفحات الويب الحديثة.
                  </p>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-cyan-500/20 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono-tech">
                CYBER-SENTINEL // FOUNDED BY TAHA SETRI
              </span>
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity font-mono-tech"
              >
                فهمت ذلك // موافق
              </button>
            </div>

          </div>
        </div>
      )}

    </footer>
  );
};
