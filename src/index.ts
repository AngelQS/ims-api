// Local
import Server from "./server/server";
import Database from "./database/database";

async function init() {
  try {
    console.log("first server");
    await Server.start();
    await Database.start();
  } catch (err) {
    throw new Error("Unable to running server");
  }
}

init();
