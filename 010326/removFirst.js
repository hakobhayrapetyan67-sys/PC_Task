function removeFirst(str){
	let newStr = "";
	for(let i = 1; i < str.length; ++i){
		newStr += str[i];
	}
	return newStr;
}

let str1 = "hello";
let str2 = 'a';
let str3 = "";

console.log(removeFirst(str1));
console.log(removeFirst(str2));
console.log(removeFirst(str3));
