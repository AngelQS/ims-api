export default function isValidPassword(password: string) {
  const passwordRegex = new RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}$/g
  );
  return passwordRegex.test(password);
}
