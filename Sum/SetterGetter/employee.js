class Person{
	constructor(firstName, lastName){
		this.firstName = firstName;
		this.lastName = lastName;
	}
	getInfo(){
		return `${this.firstName}, ${this.lastName}`;
	}
}

let p1 = new Person("Anna", "Yayloyan");
console.log(p1.getInfo());
