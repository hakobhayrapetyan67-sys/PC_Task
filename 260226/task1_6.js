function maxIndex(arr, x){
	let index = 0;
	for(let i = 0; i <= arr.length; ++i) {
		if(arr[i] == x){
			index = i;
		}
	}
	return index;
}

let arr = [3, 6, 9, 12];
let x = 9;
console.log(maxIndex(arr, x));
