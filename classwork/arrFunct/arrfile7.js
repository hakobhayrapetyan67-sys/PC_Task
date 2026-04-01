function doubleArr(arr){
	for(let i = 0; i < arr.length; ++i){
		arr[i] += arr[i];
	}
	return arr;
}

let arr = [1, 2, 3];
console.log(doubleArr(arr));
