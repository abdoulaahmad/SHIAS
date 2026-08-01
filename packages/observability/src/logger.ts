import pino, { Logger as PinoLogger } from 'pino';

export interface Logger {
  info(msg: string, obj?: any): void;
  error(msg: string, obj?: any): void;
  warn(msg: string, obj?: any): void;
  debug(msg: string, obj?: any): void;
  child(bindings: Record<string, any>): Logger;
}

export class PinoLoggerAdapter implements Logger {
  constructor(private readonly pinoLogger: PinoLogger) {}

  info(msg: string, obj?: any): void {
    if (obj) this.pinoLogger.info(obj, msg);
    else this.pinoLogger.info(msg);
  }

  error(msg: string, obj?: any): void {
    if (obj) this.pinoLogger.error(obj, msg);
    else this.pinoLogger.error(msg);
  }

  warn(msg: string, obj?: any): void {
    if (obj) this.pinoLogger.warn(obj, msg);
    else this.pinoLogger.warn(msg);
  }

  debug(msg: string, obj?: any): void {
    if (obj) this.pinoLogger.debug(obj, msg);
    else this.pinoLogger.debug(msg);
  }

  child(bindings: Record<string, any>): Logger {
    return new PinoLoggerAdapter(this.pinoLogger.child(bindings));
  }
}

export function createLogger(env: string = process.env.NODE_ENV || 'development'): Logger {
  const isDev = env === 'development';
  const instance = pino({
    level: isDev ? 'debug' : 'info',
    transport: isDev ? { target: 'pino-pretty' } : undefined,
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
  });
  return new PinoLoggerAdapter(instance);
}
