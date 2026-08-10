let person1 = {
	name : "Armen",
	age : 20
}

Object.freeze(person1);

person1.age = 24;
person1.syti = "Yerevan";

console.log(person1);
