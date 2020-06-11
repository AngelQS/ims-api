// Third
import { parse } from "dotenv";

// Local
import { CONFIG_SYMBOLS } from "./config.constants";
import { Container } from "../../global/global.container";
import { IJson } from "../../global/global.interfaces";
import { readFileSync } from "fs";
import { resolve } from "path";
import { Mapper } from "../../helpers/mapper.helpers";

// Initializations
const ENV = process.env.NODE_ENV;

class ConfigService extends Mapper {
  constructor(
    protected readonly mapper: Container<Symbol> = new Container<Symbol>(),
    private readonly configSymbols: IJson<Symbol> = CONFIG_SYMBOLS
  ) {
    super(mapper);
    this.init();
  }

  private init() {
    this.setupEnvironmentVariables();
  }

  private setupEnvironmentVariables() {
    let envs: IJson;
    envs = // Environment variables
      ENV === "production"
        ? process.env
        : parse(readFileSync(resolve(process.cwd(), `.${ENV}.env`)));
    const vars = Object.entries(envs);
    const symbols = Object.entries(this.configSymbols);
    this.mapOut(vars, symbols);
  }
}

export const configService = new ConfigService();
