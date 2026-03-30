function sumArr(arr){
	let sum = 0;
	for(let i = 0; i < arr.length; ++i){
		sum += arr[i];
	}
	return sum;
}

let arr1 = [1,2,3];
let arr2= [-1, 1];
let arr3 = [5];
console.log(sumArr(arr1));
console.log(sumArr(arr2));
console.log(sumArr(arr3));
