function arrSum(a) {
	let sum = 0;
	for(let i = 0; i < a.length; ++i){
		sum += a[i];
	}
	return sum;
}

let a = [10, 20, 30, 40];
document.write(arrSum(a));
console.log(arrSum(a));
