import * as configurationProvider from "../configuration/configuration-provider";
import { Client, ConnectionConfig } from "pg";
import { logger } from "../logger/logger-wrapper";
import { stopWebServer } from "../../server";

let dbCLient: Client;

export default async function getDbConnection(): Promise<Client | undefined> {
  const dbConfig: ConnectionConfig = configurationProvider.getValue("DB");
  try {
    if (!dbCLient) {
      logger.debug({ msg: "Connecting to DB", metadata: { dbConfig } });

      dbCLient = new Client(dbConfig);
      await dbCLient.connect();
      logger.info({
        msg: "Connected Successfully to DB",
        metadata: { dbConfig },
      });

      return dbCLient;
    }
    return dbCLient;
  } catch (error) {
    logger.error({
      msg: "Failed to connect DB",
      metadata: { error, dbConfig },
    });
    stopWebServer();
  }
}
