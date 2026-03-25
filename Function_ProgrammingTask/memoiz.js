function memois(cb){
	let obj = {};

	return function(arg){
		if(obj[arg] !== undefined){
			return obj[arg];
		}

		let res = cb(arg);
		obj[arg] = res;
		return res;
	}
}


function fact(a){
	let res = 1;
	for(let i = 2; i <= a; ++i){
		res *= i;
	}
	return res;
}

const foo = memois(fact);

console.log(foo(5));


