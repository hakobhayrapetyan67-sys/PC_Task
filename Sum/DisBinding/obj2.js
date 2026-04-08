function foo(){
	return `${this.name} has ${this.points}`;
}
const p1 = {name: "Anna", points: 10};
const p2 = {name: "Mark", points: 25};

console.log(foo.call(p1));
console.log(foo.call(p2));
