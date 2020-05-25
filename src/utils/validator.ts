// Local
import capitalize from "./capitalize";
import isValidEmail from "./is-valid-email";
import isValidName from "./is-valid-name";
import isValidPassword from "./is-valid-password";

export default function validator({ ...data }: { [x: string]: any }) {
  for (const key in data) {
    let result = true;
    switch (key) {
      case "name":
        data[key] = capitalize(data[key].toString().toLowerCase());
        if (!isValidName(data[key])) {
          result = false;
        }
        break;

      case "email":
        data[key] = data[key].toString().toLowerCase();
        if (!isValidEmail(data[key])) {
          result = false;
        }
        break;
      case "password":
        if (!isValidPassword(data[key])) {
          result = false;
        }
        break;

      default:
        result = false;
        break;
    }
  }
  return data;
}
