import { config as dotenv } from "dotenv";
dotenv();

export default class EnvironmentVariables {
  static NODE_ENV = process.env.NODE_ENV || "development";
  static NODE_PORT = process.env.NODE_PORT || 3000;
  static MONGODB_URI =
    process.env.IMS_MONGODB_ATLAS_URI || "mongodb://localhost/db_ims";
}
