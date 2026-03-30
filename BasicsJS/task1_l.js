function sum(x, y) {
	if(x === y) {
		return x + y;
	}
	else {
		return "invalid input";
	}
}


let x = prompt("enter the number");
let y = +prompt("enter the number");

console.log(sum(x, y));
