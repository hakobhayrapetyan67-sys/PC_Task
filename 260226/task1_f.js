function numbers(x) {
	let y = +x;
	if(y == NaN){
		return null;
	}
	return y;
}

let x = prompt("enter the number");
console.log(numbers(x));
