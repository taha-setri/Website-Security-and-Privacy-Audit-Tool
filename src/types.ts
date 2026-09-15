export type SecurityGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
export type ThreatLevel = 'SECURE' | 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
export type CheckStatus = 'pass' | 'warn' | 'fail' | 'info';
export type CheckSeverity = 'critical' | 'high' | 'medium' | 'low' | 'good';

export interface ChecklistItem {
  id: string;
  name: string;
  nameAr: string;
  status: CheckStatus;
  value: string;
  descriptionAr: string;
  recommendationAr: string;
  severity: CheckSeverity;
  category: 'ssl' | 'headers' | 'privacy' | 'network' | 'vulnerabilities';
  specReference?: string;
  fixSnippet?: string;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'DANGER' | 'TRACE';
  text: string;
  tag: string;
}

export interface CategoryResult {
  key: string;
  titleAr: string;
  titleEn: string;
  score: number;
  maxScore: number;
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'VULNERABLE';
  items: ChecklistItem[];
}

export interface AuditResult {
  url: string;
  cleanDomain: string;
  scannedAt: string;
  overallScore: number;
  securityGrade: SecurityGrade;
  threatLevel: ThreatLevel;
  ipAddress: string;
  serverLocation: string;
  responseTimeMs: number;
  tlsVersion: string;
  cipherSuite: string;
  certExpiryDays: number;
  certIssuer: string;
  categories: {
    ssl: CategoryResult;
    headers: CategoryResult;
    privacy: CategoryResult;
    network: CategoryResult;
    vulnerabilities: CategoryResult;
  };
  totalChecks: number;
  passedChecks: number;
  warnChecks: number;
  failedChecks: number;
}
