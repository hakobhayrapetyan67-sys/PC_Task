function minArr(arr){
	let min = arr[0];
	for(let i = 1; i < arr.length; ++i){
		if(min > arr[i]){
			min = arr[i];
		}
	}
	return min;
}


let arr1 = [3, 1, 5];
let arr2 = [-2, -10, 0];
let arr3 = [7];

console.log(minArr(arr1));
console.log(minArr(arr2));
console.log(minArr(arr3));
