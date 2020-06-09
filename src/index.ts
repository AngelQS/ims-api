// Local
import Server from "./server/server";
import Database from "./database/database";

async function init() {
  try {
    Server.start();
    Database.start();
  } catch (err) {
    throw new Error("Unable to running server");
  }
}

init();
