let person = {
	name : "hakob",
	age : 22
}

let jsonString = JSON.stringify(person);
console.log(jsonString);

let newObj = JSON.parse(jsonString);
console.log(newObj);
