function arrAvg(arr){
	let sum = 0;
	let count = 0;
	for(let i = 0; i < arr.length; ++i){
		sum += arr[i];
		++count;
	}
	return sum / count;
}

let arr1 = [2,4,6];
let arr2 = [1,1,1,1];
let arr3 = [5];
console.log(arrAvg(arr1));
console.log(arrAvg(arr2));
console.log(arrAvg(arr3));
