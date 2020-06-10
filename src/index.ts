// Local
import Server from "./server/server";
import Database from "./database/database";

async function init() {
  console.log(process.env.NODE_ENV);
  console.log(process.env.NODE_PORT);
  try {
    Server.start();
    Database.start();
  } catch (err) {
    throw new Error("Unable to running server");
  }
}

init();
