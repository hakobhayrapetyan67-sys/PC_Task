function myNew(Constructor, ...args) {
  const instance = Object.create(Constructor.prototype);

  const result = Constructor.apply(instance, args);

  if (result !== null && (typeof result === 'object' || typeof result === 'function')) {
    return result;
  }

  return instance;
}


function User(name) {
  this.name = name;
}
const user = myNew(User, "Alex");
console.log(user.name); // Alex
console.log(Object.getPrototypeOf(user) === User.prototype); // true
console.log(user.constructor === User); // true

function Car(model) {
  this.model = model;
  return { custom: "returned object" };
}
const car = myNew(Car, "BMW");
console.log(car.custom); // returned object

function Empty() {}
const obj = myNew(Empty);
console.log(Object.getPrototypeOf(obj) === Empty.prototype); // true

function Test() {
  return 123;
}
const test = myNew(Test);
console.log(Object.getPrototypeOf(test) === Test.prototype); // true
