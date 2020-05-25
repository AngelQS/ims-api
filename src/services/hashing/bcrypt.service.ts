// Third
import bcrypt from "bcryptjs";

export default class BcryptService {
  protected input: string;
  protected comparisonVal: string;

  constructor(input: string, comparisonVal: string = "") {
    this.input = input;
    this.comparisonVal = comparisonVal;
  }

  protected genSalt(): string {
    const salt = bcrypt.genSaltSync(12);
    return salt;
  }

  hash(): string {
    return bcrypt.hashSync(this.input, this.genSalt());
  }

  compare(): Promise<boolean> {
    return bcrypt.compare(this.input, this.comparisonVal);
  }
}
