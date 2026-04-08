function foo(sum, arr){
	return sum.apply(null, arr);
}

function sum(a, b, c){
	return a + b + c;
}
console.log(foo(sum, [2, 4, 6]));
