import connect, { DatabaseConnection } from "@databases/sqlite";
import * as configurationProvider from "../configuration/configuration-provider";
import { logger } from "../logger/logger-wrapper";

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
    logger.error(`Failed to connect DB`); //TO DO handle the error here terminate the application
    throw error;
  }
}
