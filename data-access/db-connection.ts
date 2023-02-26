import connect, { DatabaseConnection } from "@databases/sqlite";

let dbConnection: DatabaseConnection;

export default function getDbConnection() {
  if (!dbConnection) {
    dbConnection = connect("url_db");
  }
  return dbConnection;
}
