function evenOdd(x) {
	if(x % 2 == 0)
		return "even";
	else
		return"odd";
}

let x = +prompt("enter the number");
console.log(evenOdd(x));
