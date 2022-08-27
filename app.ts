import express from "express";
import dotenv from "dotenv";
import * as http from "http";
import * as winston from "winston";
import debug from "debug";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import * as expressWinston from "express-winston";
import cors from "cors";

import { CommonRoutesConfig } from "./common/common.routes.config";
import { UsersRoutes } from "./users/users.routes.config";
import { AuthRoutes } from "./auth/auth.routes.config";
import { ConfigRoutes } from "./config/config.routes.config";

import { errorHandler } from "./common/handlers/error.handler";
import { HttpStatusCode } from "./common/constants/httpStatusCode.constants";

const app: express.Application = express();
const dotenvResult = dotenv.config();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// parse all incoming requests as JSON
app.use(express.json());

// allow cross-origin requests
app.use(cors());

// helmet
app.use(helmet());

// apply limiter
app.use(limiter);

// expressWinston config
// will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (dotenvResult.error) {
  throw dotenvResult.error;
}

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
  if (typeof global.it === "function") {
    loggerOptions.level = "http"; // for non-debug test runs, squelch entirely
  }
}

// initialize logger
app.use(expressWinston.logger(loggerOptions));

// error handling
process.on("unhandledRejection", (reason: Error, promise: Promise<any>) => {
  debugLog("catched unhandledRejection", reason);
  throw reason;
});

process.on("uncaughtException", (error: Error) => {
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) {
    process.exit(1);
  }
});

// add routes
routes.push(new UsersRoutes(app));
routes.push(new AuthRoutes(app));
routes.push(new ConfigRoutes(app));

// make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(HttpStatusCode.SUCCESS).send(runningMessage);
});

export default server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  console.log(runningMessage);
});
