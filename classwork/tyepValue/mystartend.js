function foo(start, end, str){
	let result = "";
	for(let i = start; i < end; ++i){
		result += str[i];
	}
	return result;
}


let start = 0;
let end = 4;
let str = "javascript";
console.log(foo(start, end, str));
