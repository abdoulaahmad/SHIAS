import { AsyncLocalStorage } from 'async_hooks';

export interface CorrelationData {
  correlationId: string;
}

export const correlationContext = new AsyncLocalStorage<CorrelationData>();

export function getCorrelationId(): string {
  const store = correlationContext.getStore();
  return store?.correlationId || 'system-fallback-id';
}
