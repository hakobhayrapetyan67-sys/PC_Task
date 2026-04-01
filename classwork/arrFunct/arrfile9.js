function miavorumArr(arr){
	let result = [];
	for(let i = 0; i < arr.length; ++i){
		
		for(let j = 0; j < arr[i].length; ++j){
			result.push(arr[i][j]);
		}
	}
	return result;
}


let arr = [1,2,[3,4,],5,6];
console.log(miavorumArr(arr));
