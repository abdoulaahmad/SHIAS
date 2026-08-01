export enum AuditCategory {
  SECURITY = 'SECURITY',
  CONSENT = 'CONSENT',
  ACCESS = 'ACCESS',
  REGISTRATION = 'REGISTRATION',
  SYSTEM = 'SYSTEM'
}

export enum AuditSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export enum AuditOutcome {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}
