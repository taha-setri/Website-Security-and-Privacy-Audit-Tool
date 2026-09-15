import { AuditResult, ChecklistItem, SecurityGrade, ThreatLevel, TerminalLog } from '../types';

export function sanitizeUrl(input: string): { cleanDomain: string; fullUrl: string; isHttpOnly: boolean } {
  let trimmed = input.trim();
  if (!trimmed) {
    trimmed = 'example-portal.com';
  }
  
  let isHttpOnly = false;
  if (trimmed.startsWith('http://')) {
    isHttpOnly = true;
  } else if (!trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    return {
      cleanDomain: parsed.hostname || trimmed.replace(/https?:\/\//, '').split('/')[0],
      fullUrl: trimmed,
      isHttpOnly
    };
  } catch {
    const clean = trimmed.replace(/https?:\/\//, '').split('/')[0] || 'target-domain.com';
    return {
      cleanDomain: clean,
      fullUrl: isHttpOnly ? `http://${clean}` : `https://${clean}`,
      isHttpOnly
    };
  }
}

export function generateAuditResult(rawInput: string): AuditResult {
  const { cleanDomain, fullUrl, isHttpOnly } = sanitizeUrl(rawInput);
  const domainLower = cleanDomain.toLowerCase();

  // Preset behavior profiles for demo realism
  const isHighSecurity = domainLower.includes('google') || domainLower.includes('github') || domainLower.includes('cloudflare') || domainLower.includes('apple') || domainLower.includes('gov');
  const isInsecure = isHttpOnly || domainLower.includes('insecure') || domainLower.includes('http') || domainLower.includes('test-fail');
  const isModerate = !isHighSecurity && !isInsecure;

  // Compute realistic scores
  let sslScore = isHighSecurity ? 98 : (isInsecure ? 25 : 88);
  let headersScore = isHighSecurity ? 94 : (isInsecure ? 30 : 76);
  let privacyScore = isHighSecurity ? 90 : (isInsecure ? 40 : 82);
  let networkScore = isHighSecurity ? 96 : (isInsecure ? 45 : 85);
  let vulnScore = isHighSecurity ? 95 : (isInsecure ? 35 : 80);

  const overallScore = Math.round((sslScore * 0.25) + (headersScore * 0.3) + (privacyScore * 0.2) + (networkScore * 0.15) + (vulnScore * 0.1));

  let securityGrade: SecurityGrade = 'B';
  let threatLevel: ThreatLevel = 'LOW';

  if (overallScore >= 92) {
    securityGrade = 'A+';
    threatLevel = 'SECURE';
  } else if (overallScore >= 85) {
    securityGrade = 'A';
    threatLevel = 'LOW';
  } else if (overallScore >= 75) {
    securityGrade = 'B';
    threatLevel = 'MODERATE';
  } else if (overallScore >= 60) {
    securityGrade = 'C';
    threatLevel = 'ELEVATED';
  } else {
    securityGrade = 'F';
    threatLevel = 'CRITICAL';
  }

  // Pseudo-random but deterministic IP & metrics based on domain string
  const hash = domainLower.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const ipPart1 = (hash % 150) + 50;
  const ipPart2 = (hash * 3 % 200) + 10;
  const ipPart3 = (hash * 7 % 250) + 1;
  const ipPart4 = (hash * 11 % 250) + 1;
  const ipAddress = `${ipPart1}.${ipPart2}.${ipPart3}.${ipPart4}`;
  const responseTimeMs = Math.floor((hash % 90) + 24);

  // SSL / TLS Items
  const sslItems: ChecklistItem[] = [
    {
      id: 'ssl-1',
      name: 'HTTPS Strict Enforcement',
      nameAr: 'إلزامية بروتوكول HTTPS المشفر',
      status: isInsecure ? 'fail' : 'pass',
      value: isInsecure ? 'HTTP غير مشفر (نقل البيانات بالنص الصريح)' : 'فرض إعادة التوجيه 301 المشفرة بالكامل',
      descriptionAr: 'يضمن تحويل جميع طلبات الزوار إلى النسخة المشفرة الآمنة تلقائياً ومنع التنصت (Man-In-The-Middle).',
      recommendationAr: isInsecure ? 'قم بتفعيل إعادة توجيه 301 دائمة لجميع طلبات HTTP إلى HTTPS وتفعيل شهادة SSL معتمدة.' : 'التهيئة الحالية ممتازة وتفي بالمعايير القياسية العالمية.',
      severity: isInsecure ? 'critical' : 'good',
      category: 'ssl',
      specReference: 'RFC 2818',
      fixSnippet: `# Nginx Configuration:\nserver {\n    listen 80;\n    server_name ${cleanDomain};\n    return 301 https://$host$request_uri;\n}`
    },
    {
      id: 'ssl-2',
      name: 'TLS Version',
      nameAr: 'إصدار بروتوكول أمان طبقة النقل (TLS)',
      status: isInsecure ? 'fail' : 'pass',
      value: isInsecure ? 'TLS 1.0 (متقادم وغير آمن)' : 'TLS 1.3 (أحدث بروتوكول تشفير فائق السرعة والأمان)',
      descriptionAr: 'يحدد إصدار التشفير النشط. بروتوكول TLS 1.3 يحظر الخوارزميات الضعيفة ويسرع المصافحة الأمنية (0-RTT).',
      recommendationAr: isInsecure ? 'قم بتعطيل TLS 1.0 و TLS 1.1 في خادم الويب واعتمد حصراً TLS 1.2 و TLS 1.3.' : 'يستخدم أحدث المعايير دون أي ثغرات معروفة.',
      severity: isInsecure ? 'critical' : 'good',
      category: 'ssl',
      specReference: 'RFC 8446',
      fixSnippet: `ssl_protocols TLSv1.2 TLSv1.3;\nssl_prefer_server_ciphers on;`
    },
    {
      id: 'ssl-3',
      name: 'HSTS (HTTP Strict Transport Security)',
      nameAr: 'رأس أمان النقل الصارم (HSTS)',
      status: isHighSecurity ? 'pass' : (isInsecure ? 'fail' : 'warn'),
      value: isHighSecurity ? 'max-age=31536000; includeSubDomains; preload' : (isInsecure ? 'غير مفعل' : 'max-age=2592000 (بدون preload)'),
      descriptionAr: 'يجبر المتصفحات على الاتصال حصراً عبر HTTPS ويمنع هجمات تجريد بروتوكول الأمان (SSL Stripping).',
      recommendationAr: isHighSecurity ? 'مفعل بأقصى قوة مسجل في قائمة HSTS Preload التابعة للمتصفحات.' : 'أضف رأس Strict-Transport-Security بمدة لا تقل عن عام مع includeSubDomains.',
      severity: isHighSecurity ? 'good' : (isInsecure ? 'critical' : 'medium'),
      category: 'ssl',
      specReference: 'RFC 6797',
      fixSnippet: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
    },
    {
      id: 'ssl-4',
      name: 'Certificate Chain & Trust',
      nameAr: 'صلاحية وسلسلة شهادة الأمان (X.509)',
      status: isInsecure ? 'fail' : 'pass',
      value: isInsecure ? 'شهادة منتهية أو ذاتية التوقيع' : 'شهادة موثوقة صالحة (ECC 256-bit / RSA 2048)',
      descriptionAr: 'التحقق من توقيع جهة إصدار الشهادات الرقمية المعترف بها عالمياً وسريان صلاحيتها.',
      recommendationAr: isInsecure ? 'جدد الشهادة عبر مرجع موثوق مثل Let\'s Encrypt أو DigiCert.' : 'الشهادة صالحة وموثوقة لجميع المتصفحات والأنظمة.',
      severity: isInsecure ? 'critical' : 'good',
      category: 'ssl',
      specReference: 'CAB Forum Baseline'
    }
  ];

  // Security Headers Items
  const headersItems: ChecklistItem[] = [
    {
      id: 'hdr-1',
      name: 'Content-Security-Policy (CSP)',
      nameAr: 'سياسة أمان المحتوى (CSP)',
      status: isHighSecurity ? 'pass' : (isInsecure ? 'fail' : 'warn'),
      value: isHighSecurity ? 'default-src \'self\'; script-src \'self\' https:; object-src \'none\'' : (isInsecure ? 'غير موجود إطلاقاً (مخاطر حقن نصوص XSS عالية)' : 'سياسة جزئية بدون حظر inline scripts'),
      descriptionAr: 'الجدار الناري البرمجي للمتصفح لمنع هجمات Cross-Site Scripting (XSS) وسرقة البيانات وحقن الوسائط الخبيثة.',
      recommendationAr: 'قم بتهيئة رأس Content-Security-Policy لمنع تنفيذ السكربتات غير المصرح بها وحظر iframe المشبوهة.',
      severity: isHighSecurity ? 'good' : (isInsecure ? 'critical' : 'high'),
      category: 'headers',
      specReference: 'W3C CSP Level 3',
      fixSnippet: `Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-random'; object-src 'none'; base-uri 'self';`
    },
    {
      id: 'hdr-2',
      name: 'X-Frame-Options',
      nameAr: 'حماية اختطاف النقرات (Clickjacking)',
      status: isInsecure ? 'fail' : 'pass',
      value: isInsecure ? 'غير مهيأ (الموقع عرضة للتضمين في إطارات احتيالية)' : 'DENY / SAMEORIGIN',
      descriptionAr: 'يمنع المتصفحات من تضمين الموقع داخل إطار <iframe/frame> في مواقع خارجية لمنع خداع المستخدمين بالنقر.',
      recommendationAr: isInsecure ? 'أضف الرأس X-Frame-Options: SAMEORIGIN لمنع تضمين موقعك خارج نطاقك.' : 'مفعل بحالة مثالية.',
      severity: isInsecure ? 'high' : 'good',
      category: 'headers',
      specReference: 'RFC 7034',
      fixSnippet: `X-Frame-Options: SAMEORIGIN`
    },
    {
      id: 'hdr-3',
      name: 'X-Content-Type-Options',
      nameAr: 'منع انتحال نوع الملفات (MIME Sniffing)',
      status: isInsecure ? 'fail' : 'pass',
      value: isInsecure ? 'مفقود (خطر تفسير الصور كنصوص برمجية تنفيذية)' : 'nosniff',
      descriptionAr: 'يجبر المتصفح على احترام الـ Content-Type المعلن بدقة وعدم محاولة تخمينه أو تنفيذه كنص خبيث.',
      recommendationAr: 'أضف X-Content-Type-Options: nosniff في جميع الردود من الخادم.',
      severity: isInsecure ? 'medium' : 'good',
      category: 'headers',
      specReference: 'Fetch Spec MIME Sniffing',
      fixSnippet: `X-Content-Type-Options: nosniff`
    },
    {
      id: 'hdr-4',
      name: 'Referrer-Policy',
      nameAr: 'سياسة إحالة الروابط والخصوصية',
      status: isHighSecurity ? 'pass' : (isInsecure ? 'fail' : 'pass'),
      value: isInsecure ? 'unsafe-url (تسريب معلمات الروابط الحساسة للمواقع الأخرى)' : 'strict-origin-when-cross-origin',
      descriptionAr: 'يتحكم في مقدار معلومات التصفح والروابط المرسلة في ترويسة Referer عند الانتقال لموقع آخر.',
      recommendationAr: 'استخدم strict-origin-when-cross-origin لمنع تسريب رموز التوثيق أو معرفات الجلسات في المسارات.',
      severity: isInsecure ? 'high' : 'good',
      category: 'headers',
      specReference: 'W3C Referrer Policy',
      fixSnippet: `Referrer-Policy: strict-origin-when-cross-origin`
    },
    {
      id: 'hdr-5',
      name: 'Permissions-Policy',
      nameAr: 'سياسة صلاحيات العتاد والمستشعرات',
      status: isHighSecurity ? 'pass' : (isInsecure ? 'fail' : 'warn'),
      value: isHighSecurity ? 'camera=(), microphone=(), geolocation=(), payment=()' : (isInsecure ? 'مفقود (صلاحيات مفتوحة افتراضياً)' : 'مفعل جزئياً لبعض الخصائص'),
      descriptionAr: 'يقيد وصول السكربتات ومواقع الطرف الثالث إلى الكاميرا، الميكروفون، الموقع الجغرافي، ومستشعرات الجهاز.',
      recommendationAr: 'حدد صراحة الأجهزة المسموح بها وعطل المستشعرات غير المستخدمة كلياً.',
      severity: isHighSecurity ? 'good' : (isInsecure ? 'medium' : 'low'),
      category: 'headers',
      specReference: 'W3C Permissions Policy',
      fixSnippet: `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
    }
  ];

  // Privacy & Tracking Items
  const privacyItems: ChecklistItem[] = [
    {
      id: 'priv-1',
      name: 'Cookie Security Flags',
      nameAr: 'سمات أمان ملفات تعريف الارتباط (Cookies)',
      status: isHighSecurity ? 'pass' : (isInsecure ? 'fail' : 'pass'),
      value: isInsecure ? 'ملفات تعريف ارتباط بدون سمات Secure أو HttpOnly' : 'Secure; HttpOnly; SameSite=Strict/Lax',
      descriptionAr: 'يمنع سرقة ملفات الجلسة عبر سكربتات XSS الخبيثة ويمنع هجمات تزوير الطلبات عبر المواقع (CSRF).',
      recommendationAr: 'تأكد من ضبط كل الكوكيز بسمات Secure; HttpOnly; SameSite=Lax بشكل إلزامي.',
      severity: isInsecure ? 'critical' : 'good',
      category: 'privacy',
      specReference: 'RFC 6265bis'
    },
    {
      id: 'priv-2',
      name: 'Third-Party Tracker Exposure',
      nameAr: 'رصد متتبعات الطرف الثالث ونقاط التسريب',
      status: isHighSecurity ? 'pass' : (isInsecure ? 'warn' : 'pass'),
      value: isHighSecurity ? '0 متتبعات خارجية رُصدت (بيئة معزولة ونظيفة)' : (isInsecure ? 'رصد متتبعات سلوكية بدون إشعار موافقة' : 'متعقبات إحصائية قياسية مؤمنة ومجهولة الهوية'),
      descriptionAr: 'فحص نصوص الإعلانات والتحليلات الخارجية التي تقوم بإنشاء بصمات رقمية للزائر (Browser Fingerprinting).',
      recommendationAr: 'احرص على تقليل سكربتات الطرف الثالث وعزلها واستخدام بدائل تحترم خصوصية المستخدم مثل Plausible أو Cloudflare Analytics.',
      severity: isInsecure ? 'medium' : 'good',
      category: 'privacy'
    },
    {
      id: 'priv-3',
      name: 'Global Privacy Control (GPC) / DNT',
      nameAr: 'استجابة إشارات الخصوصية العامة (GPC/DNT)',
      status: isHighSecurity ? 'pass' : 'info',
      value: isHighSecurity ? 'الامتثال الكامل لإشارات عدم البيع والتعقب' : 'معيار اختياري مدعوم حسب تفضيل المتصفح',
      descriptionAr: 'احترام إشارة Sec-GPC المرسلة من متصفحات المستخدمين لطلب عدم بيع أو مشاركة بيانات التصفح.',
      recommendationAr: 'قم ببرمجة الخادم للتعرف على ترويسة Sec-GPC: 1 وتعطيل التتبع التجاري للزائر تلقائياً.',
      severity: 'low',
      category: 'privacy'
    }
  ];

  // Network & DNS Defense
  const networkItems: ChecklistItem[] = [
    {
      id: 'net-1',
      name: 'DNSSEC Validation',
      nameAr: 'نظام أمان أسماء النطاقات (DNSSEC)',
      status: isHighSecurity ? 'pass' : (isInsecure ? 'fail' : 'warn'),
      value: isHighSecurity ? 'مفعل وموقع بسجلات RRSIG و DS صحيحة' : (isInsecure ? 'غير مفعل (عرضة لهجمات تسميم نظام النطاقات DNS Cache Poisoning)' : 'بانتظار التحقق من سلامة تفويض DS لدى المسجل'),
      descriptionAr: 'يضمن التوقيع الرقمي لسجلات الـ DNS لمنع إعادة توجيه المستخدمين إلى خوادم تصيد احتيالية.',
      recommendationAr: 'فعل خاصية DNSSEC في لوحة تحكم مزود النطاق وقم بنشر سجل DS لدى مسجل النطاق.',
      severity: isHighSecurity ? 'good' : (isInsecure ? 'high' : 'medium'),
      category: 'network',
      specReference: 'RFC 4033'
    },
    {
      id: 'net-2',
      name: 'CAA Records (Certificate Authority Authorization)',
      nameAr: 'سجل حصر جهات إصدار الشهادات (CAA)',
      status: isHighSecurity ? 'pass' : (isInsecure ? 'warn' : 'pass'),
      value: isHighSecurity ? 'سجل CAA نشط يحصر الإصدار في Let\'s Encrypt / DigiCert' : (isInsecure ? 'غير محدد (أي جهة إصدار عالمية يمكنها إصدار شهادة للنطاق)' : 'مفعل على مستوى النطاق الرئيسي'),
      descriptionAr: 'يمنع إصدار شهادات احتيالية أو خاطئة لموقعك من قبل مراجع شهادات غير مخولة.',
      recommendationAr: 'أضف سجل DNS من نوع CAA لتحديد المراجع المصرح لها فقط بإصدار شهادات لاسم نطاقك.',
      severity: isInsecure ? 'medium' : 'good',
      category: 'network',
      specReference: 'RFC 8659'
    },
    {
      id: 'net-3',
      name: 'IPv6 Dual-Stack & CDN Shield',
      nameAr: 'دعم بروتوكول IPv6 ودرع الحماية السحابي',
      status: 'pass',
      value: 'IPv6 جاهز ومحمي بجدار ناري لطبقة التطبيقات (WAF/CDN)',
      descriptionAr: 'تأكيد جاهزية البنية التحتية لبروتوكول الإنترنت الحديث وتواجد درع تخفيف هجمات الحرمان من الخدمة (DDoS).',
      recommendationAr: 'حافظ على تحديث شهادات حافة الشبكة وفلاتر هجمات الطبقة السابعة.',
      severity: 'good',
      category: 'network'
    }
  ];

  // Vulnerability Exposure
  const vulnItems: ChecklistItem[] = [
    {
      id: 'vuln-1',
      name: 'Server Fingerprint Disclosure',
      nameAr: 'حجب بصمة الخادم والبرمجيات (Server Tokens)',
      status: isHighSecurity ? 'pass' : (isInsecure ? 'fail' : 'warn'),
      value: isHighSecurity ? 'محجوب بالكامل (رأس Server مخفي أو عام كـ cloudflare)' : (isInsecure ? 'مكشوف صراحة: Apache/2.4.41 (Ubuntu) PHP/7.4' : 'رأس مقتضب بدون أرقام إصدارات تفصيلية'),
      descriptionAr: 'كشف نوع الخادم ورقم الإصدار الدقيق يسهل على المهاجمين استهداف الثغرات الأمنية المعروفة بنقرة واحدة.',
      recommendationAr: 'قم بإخفاء رأس Server و X-Powered-By من إعدادات خادم الويب (مثل ServerTokens Prod في Apache).',
      severity: isInsecure ? 'high' : 'good',
      category: 'vulnerabilities',
      fixSnippet: `# Nginx:\nserver_tokens off;\n\n# Express.js:\napp.disable('x-powered-by');`
    },
    {
      id: 'vuln-2',
      name: 'Cross-Origin Isolation (COOP & CORP)',
      nameAr: 'عزل مساحة التصفح عبر النطاقات',
      status: isHighSecurity ? 'pass' : 'warn',
      value: isHighSecurity ? 'Cross-Origin-Opener-Policy: same-origin مفعل' : 'غير مكتمل (حماية جزئية من هجمات Spectre و Meltdown للذاكرة)',
      descriptionAr: 'يعزل سياق التصفح لمنع النوافذ المنبثقة التابعة لمواقع معادية من قراءة ذاكرة المستند.',
      recommendationAr: 'اضبط ترويسة Cross-Origin-Opener-Policy: same-origin لتعزيز عزل البيئة التنفيذية.',
      severity: isHighSecurity ? 'good' : 'low',
      category: 'vulnerabilities',
      specReference: 'HTML Spec Cross-Origin Opener Policy'
    }
  ];

  const allItems = [...sslItems, ...headersItems, ...privacyItems, ...networkItems, ...vulnItems];
  const passedChecks = allItems.filter(i => i.status === 'pass').length;
  const warnChecks = allItems.filter(i => i.status === 'warn').length;
  const failedChecks = allItems.filter(i => i.status === 'fail').length;

  return {
    url: fullUrl,
    cleanDomain,
    scannedAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    overallScore,
    securityGrade,
    threatLevel,
    ipAddress,
    serverLocation: isHighSecurity ? 'موزع سحابياً (Global Anycast Edge)' : 'خادم بيانات مخصص (Frankfurt / Ashburn)',
    responseTimeMs,
    tlsVersion: isInsecure ? 'TLS 1.0 (Deprecated)' : 'TLS 1.3 / X25519',
    cipherSuite: isInsecure ? 'RC4-MD5 / 3DES (Insecure)' : 'TLS_AES_256_GCM_SHA384',
    certExpiryDays: isInsecure ? 0 : (isHighSecurity ? 180 : 84),
    certIssuer: isInsecure ? 'Self-Signed / Untrusted' : (isHighSecurity ? 'Google Trust Services / DigiCert EV' : 'Let\'s Encrypt Authority X3'),
    categories: {
      ssl: {
        key: 'ssl',
        titleAr: 'بروتوكول HTTPS وتشفير النقل',
        titleEn: 'HTTPS & TLS Protocol',
        score: sslScore,
        maxScore: 100,
        status: sslScore > 85 ? 'OPTIMAL' : (sslScore > 60 ? 'ACCEPTABLE' : 'VULNERABLE'),
        items: sslItems
      },
      headers: {
        key: 'headers',
        titleAr: 'رؤوس حماية المتصفح (Security Headers)',
        titleEn: 'HTTP Security Headers',
        score: headersScore,
        maxScore: 100,
        status: headersScore > 85 ? 'OPTIMAL' : (headersScore > 60 ? 'ACCEPTABLE' : 'VULNERABLE'),
        items: headersItems
      },
      privacy: {
        key: 'privacy',
        titleAr: 'الخصوصية وعزل ملفات التتبع',
        titleEn: 'Privacy & Tracker Defense',
        score: privacyScore,
        maxScore: 100,
        status: privacyScore > 85 ? 'OPTIMAL' : (privacyScore > 60 ? 'ACCEPTABLE' : 'VULNERABLE'),
        items: privacyItems
      },
      network: {
        key: 'network',
        titleAr: 'أمان الشبكة وسجلات DNSSEC',
        titleEn: 'Network & DNS Security',
        score: networkScore,
        maxScore: 100,
        status: networkScore > 85 ? 'OPTIMAL' : (networkScore > 60 ? 'ACCEPTABLE' : 'VULNERABLE'),
        items: networkItems
      },
      vulnerabilities: {
        key: 'vulnerabilities',
        titleAr: 'كشف بصمة النظام ومصفوفة الثغرات',
        titleEn: 'Vulnerability & Surface Risk',
        score: vulnScore,
        maxScore: 100,
        status: vulnScore > 85 ? 'OPTIMAL' : (vulnScore > 60 ? 'ACCEPTABLE' : 'VULNERABLE'),
        items: vulnItems
      }
    },
    totalChecks: allItems.length,
    passedChecks,
    warnChecks,
    failedChecks
  };
}

export function generateSimulationLogs(targetDomain: string): TerminalLog[] {
  const now = new Date();
  const formatTime = (offsetMs: number) => {
    const t = new Date(now.getTime() + offsetMs);
    return t.toTimeString().split(' ')[0] + '.' + String(t.getMilliseconds()).padStart(3, '0');
  };

  return [
    {
      id: 'log-1',
      timestamp: formatTime(0),
      level: 'INFO',
      tag: 'INIT_CORE',
      text: `بدء تشغيل مصفوفة التدقيق السيبراني للهدف: [${targetDomain}]...`
    },
    {
      id: 'log-2',
      timestamp: formatTime(60),
      level: 'TRACE',
      tag: 'DNS_RESOLVE',
      text: `استعلام مسجلات الأسماء الجذرية DNS A/AAAA لسجلات النطاق... تم العثور على Anycast Gateway.`
    },
    {
      id: 'log-3',
      timestamp: formatTime(120),
      level: 'INFO',
      tag: 'DNSSEC_TEST',
      text: `التحقق من التوقيع التشفيري RRSIG و DS لمسجل النطاق الرئيسي...`
    },
    {
      id: 'log-4',
      timestamp: formatTime(190),
      level: 'TRACE',
      tag: 'TCP_SYN_ACK',
      text: `إرسال حزمة TCP SYN عبر المنفذ 443 و 80... استجابة الخادم في 28ms.`
    },
    {
      id: 'log-5',
      timestamp: formatTime(280),
      level: 'INFO',
      tag: 'TLS_PROBE',
      text: `إطلاق مصافحة TLS 1.3 ClientHello بمجموعة تشفير ECDHE-ECDSA-AES256-GCM...`
    },
    {
      id: 'log-6',
      timestamp: formatTime(380),
      level: 'SUCCESS',
      tag: 'CERT_VERIFIED',
      text: `فحص شهادة X.509 الرقمية وسلسلة الثقة OCSP Stapling... صالحة وغير ملغاة.`
    },
    {
      id: 'log-7',
      timestamp: formatTime(480),
      level: 'INFO',
      tag: 'HEADER_AUDIT',
      text: `استخراج رؤوس الرد HTTP Response Headers وتحليل سياسات الأمان...`
    },
    {
      id: 'log-8',
      timestamp: formatTime(560),
      level: 'TRACE',
      tag: 'CSP_ANALYZE',
      text: `اختبار سياسة أمان المحتوى (CSP): فحص مسارات script-src و style-src و object-src...`
    },
    {
      id: 'log-9',
      timestamp: formatTime(640),
      level: 'INFO',
      tag: 'FRAME_TEST',
      text: `فحص حماية Clickjacking: تقييم رأس X-Frame-Options وتوجيه frame-ancestors...`
    },
    {
      id: 'log-10',
      timestamp: formatTime(720),
      level: 'TRACE',
      tag: 'COOKIE_PROBE',
      text: `مسح ملفات تعريف الارتباط النشطة: تدقيق سمات Secure و HttpOnly و SameSite=Strict...`
    },
    {
      id: 'log-11',
      timestamp: formatTime(820),
      level: 'INFO',
      tag: 'SERVER_MASK',
      text: `فحص تسريب بصمات البرمجيات: تحليل رؤوس Server و X-Powered-By و Via...`
    },
    {
      id: 'log-12',
      timestamp: formatTime(930),
      level: 'SUCCESS',
      tag: 'AUDIT_COMPLETE',
      text: `تم استكمال التدقيق الشامل وتوليد مصفوفة درجات الأمان ومؤشرات التهديد السيبراني بنجاح!`
    }
  ];
}
