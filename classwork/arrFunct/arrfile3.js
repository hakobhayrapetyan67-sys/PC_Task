function minArr(arr){
	let min = arr[0];
	for(let i = 1; i < arr.length; ++i){
		if(min > arr[i]){
			min = arr[i];
		}
	}
	return min;
}		

let arr = [3,7,2,9];
console.log(minArr(arr));
