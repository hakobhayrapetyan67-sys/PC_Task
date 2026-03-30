function revers(str){
	let rev = "";
	for(let i = str.length - 1; i >= 0; --i) {
		rev+= str[i];
	}
	return rev;
}

let str = prompt("enter the string");
console.log(revers(str));
