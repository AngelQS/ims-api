// Local
import Server from "./server/server";
import Database from "./database/database";

try {
  const server = new Server();
  server.start();
  const database = new Database();
  database.start();
} catch (err) {
  throw new Error("Unable to running server");
}
