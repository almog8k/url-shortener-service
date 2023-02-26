import { Server } from "http";
import { AddressInfo } from "net";
import * as configurationProvider from "@practica/configuration-provider";
import configurationSchema from "../../config";
import { logger } from "@practica/logger";
import express from "express";
import helmet from "helmet";
import defineRoutes from "./routes";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { AppError, errorHandler } from "../../utils/error-handling";

let connection: Server;

async function startWebServer(): Promise<AddressInfo> {
  configurationProvider.initialize(configurationSchema);
  logger.configureLogger(
    {
      prettyPrint: Boolean(
        configurationProvider.getValue("logger.prettyPrint")
      ),
      level: "debug",
    },
    true
  );

  const expressApp = express();
  expressApp.use(helmet());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());
  defineSwaggerDoc(expressApp);
  defineRoutes(expressApp);
  defineErrorHandlingMiddleware(expressApp);
  const APIAddress = await openConnection(expressApp);
  return APIAddress;
}

async function openConnection(
  expressApp: express.Application
): Promise<AddressInfo> {
  return new Promise((resolve) => {
    const portToListenTo = configurationProvider.getValue("port");
    const webServerPort = portToListenTo || 0;
    logger.info(`server is about to listen to port ${webServerPort}`);
    connection = expressApp.listen(webServerPort, () => {
      errorHandler.listenToErrorEvents(connection);
      resolve(connection.address() as AddressInfo);
    });
  });
}

function defineErrorHandlingMiddleware(expressApp: express.Application) {
  expressApp.use(
    async (
      error: AppError,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (error && typeof error === "object") {
        if (error.isTrusted === undefined || error.isTrusted === null) {
          error.isTrusted = true;
        }
      }
      errorHandler.handleError(error);
      res
        .status(error?.HTTPStatus || 500)
        .json({ message: error.message })
        .end();
    }
  );
}

function defineSwaggerDoc(expressApp: express.Application) {
  const swaggerDocument = YAML.load(path.join(__dirname, "../../openapi.yaml"));
  expressApp.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
}

async function stopWebServer() {
  return new Promise<void>((resolve) => {
    if (connection !== undefined) {
      connection.close(() => {
        logger.info("Stopping web server");
        resolve();
      });
    }
  });
}

export { startWebServer, stopWebServer };
