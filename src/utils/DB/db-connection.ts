import connect, { DatabaseConnection } from "@databases/sqlite";
import { stopWebServer } from "../../server";
import * as configurationProvider from "../configuration/configuration-provider";
import { logger } from "../logger/logger-wrapper";

let dbConnection: DatabaseConnection;

export default function getDbConnection() {
  try {
    if (!dbConnection) {
      const dbName = configurationProvider.getValue<string>("DB.database");
      logger.info({ msg: "Connecting to DB", metadata: { dbName } });

      dbConnection = connect(dbName);
    }
    return dbConnection;
  } catch (error) {
    logger.error({ msg: "Failed to connect DB", metadata: { error } });
    stopWebServer();
  }
}
