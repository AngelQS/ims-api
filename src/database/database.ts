// Third
import mongoose from "mongoose";

// Local
import EnvironmentVariables from "../config/environment-variables";

// Initializations
const URI: string = EnvironmentVariables.MONGODB_URI;

export default class MakeDatabase {
  start() {
    mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on("connected", () => {
      console.log(">> Database is running");
    });

    mongoose.connection.on("error", (err) => {
      console.log(`>> Database error during connection: ${err}`);
    });
  }
}
