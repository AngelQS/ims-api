import { config as dotenv } from "dotenv";
dotenv();

class EnvironmentVariables {
  public NODE_ENV = process.env.NODE_ENV || "development";
  public NODE_PORT = process.env.NODE_PORT || 3000;
  public MONGODB_URI =
    process.env.IMS_MONGODB_ATLAS_URI || "mongodb://localhost/db_ims";
}

const environmentVariables = new EnvironmentVariables();
export default environmentVariables;

// file -> config.constants.ts

/* export const CONFIG = {
  NODE_ENV: Symbol("NODE_ENV"),
};

export default class EnvConfig {
  readonly #config = new Config();

  constructor() {
    this.init();
  }

  public getProperty(key: symbol): string {
    return this.#config.get(key) as string;
  }

  private init() {
    // import {parse} from 'dotenv';
    // readFileSync(resolve(process.cwd(), `.${NODE_ENV || 'development'}.env`)) -> objeto
    // parsear '.development.env' ~ '.staging.env' ~ '.production.env'
    // Object.entries(CONFIG).forEach(([key, value]: [string, symbol]) => if process.env[key] ??? -> this.config.set(value, process.env[key]))
  }
}

export class Config extends Map<symbol, string> {}

const variableDeConfiguracion = this.configService.getProperty(symbol);
 */
