function power(base, exp){
	let resul = 1;
	for(let i = 1; i <= exp; ++i){
		resul *= base;
	}
	return resul;
}

let x = 2;
let y = 3;

console.log(power(x, y));
