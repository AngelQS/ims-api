export default function capitalize(word: string) {
  return word.replace(/(?:^|\s)\S/g, function (el) {
    return el.toUpperCase();
  });
}
