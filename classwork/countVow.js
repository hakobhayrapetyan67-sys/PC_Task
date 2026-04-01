function countVowels(x){
	x = x.toLowerCase();
	let arr = ['a','e', 'i', 'o', 'u'];
	let count = 0;
	for(let a = 0; a < arr.length; ++a){
		for(let b = 0; b < x.length; ++b){
			if(arr[a] == x[b]){
				++count;
			}
		}	
	}
	
	return count;
}



let a = "hello";
let b = "HELLO";
let c = "xyz";

console.log(countVowels(b));
console.log(countVowels(c));
console.log(countVowels(a));
