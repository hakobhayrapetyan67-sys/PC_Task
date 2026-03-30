function numbers(y) {
	let count = 0;
	for(let i = 0; i < y.length; ++i) {
		if(y[i] >= 'A' && y[i] <= 'z' || y[i] <= '9') {
			++count;
		}
	}
	return count;
}


console.log(numbers("Hello"));
