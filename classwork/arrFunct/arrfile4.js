function arrReverse(arr){
	let arr2 = [];
	for(let i = arr.length -1; i >= 0; --i){
		arr2.push(arr[i]);
	}
	return arr2;
}

let arr = [1,2,3];
console.log(arrReverse(arr));
