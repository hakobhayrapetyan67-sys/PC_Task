function foo(y, z) {
	for (let i = 0; i <= y.length - z.length; i++) {
		if (y.substring(i, i + z.length) === z) {
			return true;
		}
	}
	return false;
}
let y = "Learning JavaScript";
let z = "Java";
console.log(foo(y,z);
