// Core
import fs from "fs";
import path from "path";

// Third
import jwt from "jsonwebtoken";

// Initializations
const publicKey = fs.readFileSync(
  path.join(__dirname, "../", "../", "../", "jwtRS256.key.pub"),
  "utf8"
); // get public key
const privateKey = fs.readFileSync(
  path.join(__dirname, "../", "../", "../", "jwtRS256.key"),
  "utf8"
); // get private key

export default class JsonWebTokenService {
  static async sign(payload: object): Promise<string> {
    return await jwt.sign(payload, privateKey, { algorithm: "RS256" });
  }

  static async verify(token: string): Promise<any> {
    return await jwt.verify(token, publicKey);
  }
}
