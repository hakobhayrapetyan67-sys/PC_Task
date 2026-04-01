function allEven(arr){
	for(let i = 0; i < arr.length; ++i){
		if(arr[i] % 2 != 0){
			return false;
		}
	}
	return true;
}

let arr = [2, 4, 6];
let arr1 = [2, 3, 6];
console.log(allEven(arr));
console.log(allEven(arr1));
