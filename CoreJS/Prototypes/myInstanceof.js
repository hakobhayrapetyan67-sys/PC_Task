function myInstanceOf(obj, funct){
	if(obj === null || typeof obj !== "object") return false;

	let proto = Object.getPrototypeOf(obj);
	const target = funct.prototype;

	while(proto !== null){
		if(proto === target) return true;
	
		proto = Object.getPrototypeOf(proto);
	}
	return false;
}

function Animal() {}
function Dog() {}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const dog = new Dog();
console.log(myInstanceOf(dog, Dog));      // true
console.log(myInstanceOf(dog, Animal));   // true
console.log(myInstanceOf(dog, Array));    // false
console.log(myInstanceOf(null, Object));  // false
console.log(myInstanceOf(123, Number));   // false
