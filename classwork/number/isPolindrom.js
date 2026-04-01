function isPolindrom(string){
	let x = "";
	if(string == x) {
		return true;
	}
	let a = "";
	for(let y = string.length - 1; y >= 0; --y){
		a += string[y];
	} 
	if(a == string){
		return true;
	}
	return false;

}
	
let str1 = "helo";
let str = "level";
console.log(isPolindrom(str));
console.log(isPolindrom(str1));
