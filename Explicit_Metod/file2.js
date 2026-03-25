function printResum(){
	console.log(`${this.name} scored ${this.score}`); 
}	

const student1 = {name : "Anna", score : 80};
const student2 = {name: "Mark", score : 90};

 printResum.call(student1);
 printResum.call(student2);

