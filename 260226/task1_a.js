function evenOdd(x) {
	if(x % 2 == 0)
		console.log("even");
	else
		console.log("odd");
}

let x = +prompt("enter the number");
console.log(evenOdd(x));
