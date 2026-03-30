function countDigits(n){
	n = Math.abs(n);
	if(n === 0) return 1;
	let count = 0;
	while(n != 0){
		n = Math.floor(n / 10);
		++count;
	}
	return count;
}

let x = 12345;
let y = 0;
let z = -98;

console.log(countDigits(x));
console.log(countDigits(y));
console.log(countDigits(z));
