function contains(arr, value){
	for(let i = 0; i < arr.length;++i){
		if(arr[i] == value){
			return true;
		}	
	}
	return false;
}


let arrr = [1,2,3];
let arr1 = [1,2,3];
let arr2 = [];

let char = '2';
let char1 = '5';
let char2 = '1';
console.log(contains(arrr, char));
console.log(contains(arr1, char1));
console.log(contains(arr2, char2));
