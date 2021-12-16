import { LogLevel } from "./types";
import PinoService from "./service";

const Logger = new PinoService({
  logLevel: (process.env.LOG_LEVEL as LogLevel) || "debug",
  env: process.env.ENVIRONMENT || process.env.NODE_ENV,
  serviceName: "next-pino-logging",
});

export default Logger;
