function foo(str, str2){
	for(let i = 0; i < str2.length; ++i){
		if(str[i] !== str2[i]){
			return false;
		}
	}
	return true;
}
let str = "javas";
let str2 = "jav";

console.log(foo(str, str2));
