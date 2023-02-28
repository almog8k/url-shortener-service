import connect, { DatabaseConnection, sql } from "@databases/sqlite";
import * as configurationProvider from "../utils/configuration/configuration-provider";
import { logger } from "../utils/logger/logger-wrapper";

let dbConnection: DatabaseConnection;

export default function getDbConnection() {
  try {
    if (!dbConnection) {
      const dbName = configurationProvider.getValue<string>("DB.dbName");
      logger.info(`Connecting to DB ${dbName}`);
      dbConnection = connect(dbName);
    }
    return dbConnection;
  } catch (error) {
    logger.error(`Failed to connect DB`);
    throw error;
  }
}
