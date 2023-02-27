import { LOG_LEVELS } from "../logger/definition";

export type ConfigSchema = {
  port: {
    doc: string;
    format: "Number";
    default: number;
    nullable: true;
    env: string;
  };
  DB: {
    dbName: {
      doc: string;
      format: "String";
      default: String;
      nullable: false;
      env: string;
    };
  };
  logger: {
    level: {
      doc: string;
      format: LOG_LEVELS[];
      default: LOG_LEVELS;
      nullable: false;
      env: string;
    };
    prettyPrint: {
      doc: string;
      format: "Boolean";
      default: boolean;
      nullable: false;
      env: string;
    };
  };
};
