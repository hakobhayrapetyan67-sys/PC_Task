function foo(value){
	if(typeof value !== "number") return false;
	if(value % 1 !== 0) return false;
	return true;
}

let x = "10";
console.log(foo(x));
console.log(foo(10.5));
