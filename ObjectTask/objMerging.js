let person1 = {
	name : "armen",
	age : 20
};

let person2 = {
	name : "arman",
	age : 21
};

let mergedPerson = Object.assign(person1, person2);
console.log(mergedPerson);
