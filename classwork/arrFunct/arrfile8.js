function arrHav(arr, n){
	for(let i = 0; i < arr.length; ++i){
		if(arr[i] === n){
			return true;
		}
	}
	return false;
}

let arr = [1,2,3];
let arr1 = [1,2,3];

let n = 2;
let n1 = 5;

console.log(arrHav(arr, n));
console.log(arrHav(arr1, n1));
