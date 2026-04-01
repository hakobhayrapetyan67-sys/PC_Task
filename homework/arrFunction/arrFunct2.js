function twoSum(arr, target){
	let l = 0;
	let r = arr.length - 1;

	while(l < r){
		let sum = arr[l] + arr[r];

		if(sum === target) return arr[r];
		if(sum < target) ++l;
		else r --;
	}
	return false;
}

function maxSum(arr, k){
	let sum = 0;
	
	for(let i = 0; i < k; ++i){
		sum += arr[i];
	}
	
	let max = sum;

	for(let i = k; i < arr.length; ++i){
		sum += arr[i];
		sum -= arr[i - k];
		max = Math.max(max, sum);
	}
	return max;
}

function elemSumEnd(arr){
	let newArr = [];
	newArr[0] = arr[0];

	for(let i = 1; i < arr.length; ++i){
		newArr[i] = newArr[i - 1] + arr[i];
	}
	return newArr;
}	

let arr = [1,2,3];
let target = 4;

console.log(twoSum(arr, target));
console.log(maxSum(arr, target));
console.log(elemSumEnd(arr));
