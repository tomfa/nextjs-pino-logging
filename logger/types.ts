export type GenericRequest = {
  headers: Record<string, string | string[] | undefined>;
  user?: { id?: string; sub?: string };
}

export type LogLevel =
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'

export interface LogConfig {
  serviceName?: string;
  logLevel?: LogLevel;
  env?: string;
}

export interface LogContext {
  customerId?: string;
  domain?: string; // e.g. BOOKING, AUTH
  action?: string; // e.g. USER_SIGNUP, REQUEST_PASSWORD_RESET
  value?: string | number | null;
  [key: string]: any;
}

export type RequestContext = Partial<{
  reqId: string | undefined;
  url: string | undefined;
  path: string | undefined;
  query: Record<string, string>;
  method: string | undefined;
  userId: string | undefined;
  [key: string]: any;
}>;
