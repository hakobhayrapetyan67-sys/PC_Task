function myIsNaN(value){
	return value !== value;
}

console.log(myIsNaN(NaN));
console.log(myIsNaN(15));
console.log(myIsNaN("hello"));
