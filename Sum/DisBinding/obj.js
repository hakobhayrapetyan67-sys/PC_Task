function printResult(){
	return `${this.name} scored ${this.score}`;
}

const student1 = {name: "Anna", score: 80};
const student2 = {name: "Mark", score: 95};

console.log(printResult.call(student1));
console.log(printResult.apply(student2));
