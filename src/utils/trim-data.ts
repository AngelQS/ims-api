export default function trimData({ ...data }: { [x: string]: any }) {
  for (const key in data) {
    data[key] = data[key].toString().trim();
  }
  return data;
}
