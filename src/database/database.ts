// Third
import mongoose from "mongoose";

// Local
import { configService } from "../services/config/config.service";
import { CONFIG_SYMBOLS } from "../services/config/config.constants";

// Initializations
const URI = configService.getProperty(CONFIG_SYMBOLS.DATABASE_URI);

class MakeDatabase {
  start() {
    mongoose.connect(`${URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    mongoose.connection.on("connected", () => {
      console.log(">> Database is running");
    });

    mongoose.connection.on("error", (err) => {
      console.log(`>> Database error during connection: ${err}`);
    });
  }
}

const database = new MakeDatabase();

export default database;
