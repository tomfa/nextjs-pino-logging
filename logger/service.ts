import pino, { LoggerOptions, Logger, stdTimeFunctions } from "pino";

import { LogContext, LogConfig, LogLevel } from "./types";
import { getHttpContext } from "./request.utils";

class PinoService {
  public logger: Logger;
  private serviceName: string;
  private env: string;

  constructor({
    logLevel = "info",
    serviceName = "app",
    env = "development",
    options = {},
  }: LogConfig & { options?: Omit<LoggerOptions, "level"> } = {}) {
    this.logger = pino({
      level: logLevel,
      formatters: {
        level: (label: string, number: number) => ({
          level: label,
        }),
        bindings: () => ({}),
      },
      timestamp: stdTimeFunctions.isoTime,
      ...options,
    });
    this.env = env;
    this.serviceName = serviceName;
  }

  debug(message: string, context?: LogContext) {
    return this.saveLogRecord(message, context, "debug");
  }

  info(message: string, context?: LogContext) {
    return this.saveLogRecord(message, context, "info");
  }

  warning(message: string, context?: LogContext) {
    return this.saveLogRecord(message, context, "warn");
  }

  error(message: string, context?: LogContext) {
    return this.saveLogRecord(message, context, "error");
  }

  private saveLogRecord(
    message: string,
    data?: LogContext,
    level: LogLevel = "info"
  ) {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      if (data) {
        this.logger[level](message, data)
      } else {
        this.logger[level](message)
      }
      return
    }
    const context = getHttpContext();
    this.logger[level]({
      message: message,
      serviceName: this.serviceName,
      env: this.env,
      context: { ...(data || {}), ...context },
    });
  }
}

export default PinoService;
