function myIsFinite(value){
	if(typeof valus !== "number") return false;
	if(value === Infinity || value === -Infinity) return false;
	if(value !== value) return false;
	return true;
}

console.log(myIsFinite(25));
console.log(myIsFinite(Infinity));
console.log(myIsFinite("25"));
