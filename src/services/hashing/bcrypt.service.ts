// Third
import bcrypt from "bcryptjs";

class BcryptService {
  protected genSalt(): string {
    const salt = bcrypt.genSaltSync(12);
    return salt;
  }

  public hash(password: string): string {
    return bcrypt.hashSync(password, this.genSalt());
  }

  public compare(
    password: string,
    comparisonPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, comparisonPassword);
  }
}

const bcryptService = new BcryptService();

export default bcryptService;
