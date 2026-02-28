function foo(x, y){
	for(let a = 0; a < x.length; ++a) {
		for(let b = 0; b < y.length; ++b) {
			if(x[a] == y[b]) {
				return true;
			}
		}
	}
	return false;
}	

let x = prompt("enter the string");
let y = prompt("enter the string");


console.log(foo(x, y));
