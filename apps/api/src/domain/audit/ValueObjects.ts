import crypto from 'crypto';

export class AuditEventId {
  private constructor(public readonly value: string) {}
  
  static create(): AuditEventId {
    return new AuditEventId(crypto.randomUUID());
  }

  static from(value: string): AuditEventId {
    return new AuditEventId(value);
  }
}

export class Actor {
  constructor(public readonly id: string) {}
}

export class Resource {
  constructor(public readonly id: string) {}
}

export class AuditMetadata {
  constructor(public readonly details: Record<string, any>) {}
}
