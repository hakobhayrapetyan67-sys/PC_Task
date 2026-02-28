function foo(y, z) {
	for(let i = 0; i < y.length; ++i){
		for(let b = 0; b < z.length; ++b){
			if(y[i] == z[b]){
				return true;
			}
		}
	}
	return false;
}


let y = "Learning JavaScript";
let z = "Java";

console.log(foo(y,z));
