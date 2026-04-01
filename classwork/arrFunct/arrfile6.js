function positiveOnly(arr){
	let arr2 = [];
	for(let i = 0; i < arr.length; ++i){
		if(arr[i] > 0){
			arr2.push(arr[i]);
		}
	}	
	return arr2;
}

let arr = [-1, 2, -3,4];
console.log(positiveOnly(arr));
