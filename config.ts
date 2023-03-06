import { ConfigSchema } from "./src/utils/configuration/configuration-schema";

export const configurationSchema: ConfigSchema = {
  port: {
    doc: "The API listening port. By default is 0 (ephemeral) which serves as a dynamic port for testing purposes. For production use, a specific port must be assigned",
    format: "Number",
    default: 0,
    nullable: true,
    env: "PORT",
  },
  logger: {
    level: {
      doc: "Which type of logger entries should actually be written to the target medium (e.g., stdout)",
      format: ["debug", "info", "warn", "error", "critical"],
      default: "info",
      nullable: false,
      env: "LOGGER_LEVEL",
    },
    prettyPrint: {
      doc: "Weather the logger should be configured to pretty print the output",
      format: "Boolean",
      default: true,
      nullable: false,
      env: "PRETTY_PRINT_LOG",
    },
  },
  DB: {
    dbName: {
      doc: "The default database name",
      format: "String",
      default: "url_db",
      nullable: false,
      env: "DB_NAME",
    },
  },
  swagger: {
    doc: "The default swagger file path",
    format: "String",
    default: "../../openapi.yaml",
    env: "SWAGER_PATH",
    nullable: true,
  },
};
