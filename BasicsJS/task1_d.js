function compare(x, z) {
	return {     
		loose: x == z,
		strict: x === z
	};
}

let x = 5;
let z = "4";
console.log(compare(x, z));
