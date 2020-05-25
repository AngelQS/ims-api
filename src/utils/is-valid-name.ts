export default function isValidName(name: string) {
  const nameRegex = new RegExp(
    /^([a-zA-Z]){2,}((([' -][a-zA-Z])?[a-zA-Z])){0,29}$/g
  );
  return nameRegex.test(name);
}
