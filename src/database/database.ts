// Third
import mongoose from "mongoose";

// Local
import EnvironmentVariables from "../config/environment-variables";

// Initializations
const { MONGODB_URI: URI } = EnvironmentVariables;
console.log("THE URI:", URI);
class MakeDatabase {
  start() {
    mongoose.connect(`${URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
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
