function firstLast(arr){
	if(arr.length === 0){ return [];}	
	let newArr = [];
	newArr[0]= arr[0];
	newArr[1] = arr[arr.length - 1];
	return newArr;
}

let arrr = [1,2,3];
let arr1 = [5];
let arr2 = [];

console.log(firstLast(arrr));
console.log(firstLast(arr1));
console.log(firstLast(arr2));
