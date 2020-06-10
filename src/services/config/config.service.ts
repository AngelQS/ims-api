// Third
import { parse } from "dotenv";

// Local
import { CONFIG_SYMBOLS } from "./config.constants";
import { Container } from "../../global/global.container";
import { IJson } from "../../global/global.interfaces";
import { readFileSync } from "fs";
import { resolve } from "path";

class ConfigService {
  private readonly configMapper = new Container<Symbol>();

  constructor(readonly configSymbols: IJson<Symbol> = CONFIG_SYMBOLS) {
    this.init();
  }

  public get<T>(symbol: symbol): T {
    return this.configMapper.get(symbol);
  }

  private init() {
    this.setupEnvironmentVariables();
  }

  private setupEnvironmentVariables() {
    const ENV = process.env.NODE_ENV;
    console.log("ENV??:", ENV);
    let envVars: IJson;
    if (ENV === "production") {
      envVars = process.env;
    }
    const pathToFile = process.cwd();
    const filename = `.${ENV}.env`;
    envVars = parse(readFileSync(resolve(pathToFile, filename)));
    envVars = Object.entries(envVars);
    const configSym = Object.entries(this.configSymbols);
    envVars.forEach(([key, value]: [string, string]) => {
      configSym.forEach(([_key, _value]) => {
        if (key === _key) {
          this.configMapper.set(_value, value);
        }
      });
    });
  }
}

export const configService = new ConfigService();
