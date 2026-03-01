function countChar(str, char){
	let count = 0;
	for(let i = 0; i < str1.length;++i){
		if(str[i] == char){
			++count;
		}	
	}
	return count;
}

let str1 = "hello";
let str2 = "JavaScript";
let str3 = "abc";

let char1 = 'l';
let char2 = 'a';
let char3 = 'd';

console.log(countChar(str1, char1));
console.log(countChar(str2, char2));
console.log(countChar(str3, char3));
