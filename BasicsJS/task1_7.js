function arrSum(exp) {
	let sum = 0;
	for(let i = 0; i < exp.length; ++i) {
		sum += exp[i];
	}
	return sum;
}	

let exp = [50, 75, 100];
let sum = 0;

console.log(arrSum(exp));
