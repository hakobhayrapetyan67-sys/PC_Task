function checkProperty(obj, key){
	if(Object.prototype.hasOwnProperty.call(obj, key)) return "own";
	if(key in obj) return "inherited";
	return "not found";
}

const animal = { eats: true };
const dog = Object.create(animal);
dog.name = "Rex";

console.log(checkProperty(dog, "name")); // own
console.log(checkProperty(dog, "eats")); // inherited
console.log(checkProperty(dog, "age"));  // not found


const objNull = Object.create(null);
objNull.value = 10;

console.log(checkProperty(objNull, "value"));    // own
console.log(checkProperty(objNull, "toString")); // not found
console.log(checkProperty({}, "toString"));      // inherited 
