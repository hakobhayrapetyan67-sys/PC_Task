function sumUpTo(n){
	let sum = 0;
	while(n != 0){
		sum += n;
		--n
	}
	return sum;
}

let x = 1;
let y = 5;
let z = 10;

console.log(sumUpTo(x));
console.log(sumUpTo(y));
console.log(sumUpTo(z));
