function repeatString(str, exp){
	let string = "";
	for(let i = 1;i <= exp; ++i){
		string += str;
	}
	return string;
}

let strr = "a";
let str1 = "hi";
let str2 = "x";

let expp = 3;
let exp1 = 1;
let exp2 = 0;

console.log(repeatString(strr, expp));
console.log(repeatString(str1, exp1));
console.log(repeatString(str2, exp2));
