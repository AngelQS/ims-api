// Local
import { Container } from "../global/global.container";

export abstract class Mapper {
  protected mapper: Container<Symbol>;

  constructor(mapper: Container<Symbol>) {
    this.mapper = mapper;
  }

  public getProperty<T>(symbol: Symbol): T {
    return this.mapper.get(symbol);
  }

  protected mapOutSingle(symbol: Symbol, value: any): void {
    this.mapper.set(symbol, value);
  }

  protected mapOut(
    keys: Array<[string, string]>,
    values: Array<[string, Symbol]>
  ): void {
    keys.forEach(([key, value]: [string, string]) => {
      values.forEach(([_key, _value]: [string, Symbol]) => {
        if (key === _key) {
          this.mapper.set(_value, value);
        }
      });
    });
  }
}
