function foo(str, str2){
	let start = str.length - str2.length; // 10 - 6 = 4 
	for(let i = str2.length -1; i >= 0; --i){
		if(str2[i] !== str[start + i]){
			return false;
		}
	}
	return true;
}


let str = "javascript";
let str2 = "script";
console.log(foo(str, str2));
