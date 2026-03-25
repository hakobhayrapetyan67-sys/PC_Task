
const sum = (a, b, c) => a + b + c;

let arr = [10, 20, 20];

const sumRes = sum.apply(null, arr);
console.log(sumRes);
