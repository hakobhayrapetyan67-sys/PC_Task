function sumArr(arr){
    let sum = 0;
    for(let i = 0; i < arr.length; ++i){
        sum += arr[i];
    }
    return sum;
}

function minArr(arr){
    let min = arr[0];
    for(let i = 0; i < arr.length; ++i){
        if(min > arr[i]){
            min = arr[i];
        }
    }
    return min;
}

function evenCount(arr){
    let count = 0;
    for(let i = 0; i < arr.length; ++i){
        if(arr[i] % 2 === 0){
            ++count;
        }
    }
    return count;
}

function revArr(arr){
    let newArr = [];
    for(let i = arr.length - 1; i >= 0; --i){
        newArr.push(arr[i]);
    }
    return newArr;
}

function elem(arr, x){
    for(let i = 0; i < arr.length; ++i){
        if(arr[i] === x){
            return true;
        }
    }
    return false;
}


let arr = [1,2,3];

let sum = sumArr(arr);
console.log(sum);

let min = minArr(arr);
console.log(min);

let count = evenCount(arr);
console.log(count);

let resv = revArr(arr);
console.log(resv);

let x = 3;
let elemm = elem(arr, x);
console.log(elemm);


//karevor en

function duplicats(arr){
	let newArr = [];
	for(let i = 0; i < arr.length; ++i){
		let exists = false;

		for(let j = 0; j < newArr.length; ++j){
			if(arr[i] === newArr[j]){
				exists = true;
				break;
			}
		}
		if(!exists){
			newArr.push(arr[i]);
		}
	}
	return newArr;
}

function mergArr(arr1, arr2){
	let newArr = [];
	for(let i = 0; i < arr1.length; ++i){
		newArr.push(arr1[i]);
	}	
	for(let i = 0; i < arr2.length; ++i){
		newArr.push(arr2[i]);
	}
	return newArr;
}

function rotateRigth(arr){
	let last  = arr[arr.length - 1];
	
	for(let i = arr.length - 1; i > 0; --i){
		arr[i] = arr[i - 1];
	}

	arr[0] = last;
	return arr;
}

function izZero(arr3){
	let arr = [];
	for(let i = 0; i < arr3.length; ++i){
		if(arr3[i] !== 0){
			arr.push(arr3[i]);
		}
	}
	for(let i = 0; i < arr3.length; ++i){
		if(arr3[i] === 0){
			arr.push(arr3[i]);
		}
	}
	return arr;
}

let arr1 = [1, 2, 1, 2, 3];
let duplicat = duplicats(arr1);
console.log(duplicat);

let arr2 = [0,0,0];
let merg = mergArr(arr1, arr2);
console.log(merg);

let rotat = rotateRigth(arr);
console.log(rotat);

let arr3 = [1,2,0, 4, 0 ,5];
let zeroend = izZero(arr3);
console.log(zeroend);


// bonus task

function rotatleft(arr){
	let first = arr[0];
	for(let i = 0; i < arr.length - 1; ++i){
		arr[i] = arr[i+1];
	}
	arr[arr.length - 1] = first;
	return arr;
}	

let arrr = [1,2,3,4];
console.log(rotatleft(arrr)); // [2,3,4,1]

let arrrr = [5,6,7,8,9];
console.log(rotatleft(arrrr)); // [6,7,8,9,5]















