const mixedMap = new Map([[1, 'num'], ['str', 'text'], [true, false]]);
const iterator = mixedMap.entries();
let next = iterator.next();

while (!next.done) {
  const [key, value] = next.value;
  if (typeof value === 'string') {
    console.log([key, value]);
  }
  next = iterator.next();
}
