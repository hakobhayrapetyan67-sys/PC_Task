/*function buble(arr){
    for(let i = 0; i < arr.length; ++i){
        for(let j = 0; j < arr.length - i - 1; ++j){
            if(arr[j] > arr[j + 1]){
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

let arr = [5,1,4,2,8];
console.log(buble(arr)); */

/*unction insertion(arr){
    for(let i = 1; i < arr.length; ++i){
        let key = arr[i];
        let j = i - 1;

        while(j >= 0 && arr[j] > key){
            arr[j + 1] = arr[j];
            --j
        }
        arr[j + 1] = key;
    }
    return arr;
}

let arr = [12, 11, 13, 5, 6];
console.log(insertion(arr));*/

/*function merge(arr){
    if(arr.length < 1) return;

    let mid = Math.floor(arr.length / 2);
    let left = merge(arr.slice(0, mid));
    let right = merge(arr.slice(mid));

    return sort(left, right);
}

function sort(left, right){
    let l = 0;
    let r = 0;
    let newArr = [];
    while(l < left.length && r < right.length){
        if(left[l] < right[r]){
            newArr.push(left[l]);
            ++l;
        } else{
            newArr.push(right[r]);
            ++r;
        }
    }
    while(l < left.length){
        newArr.push(left[l]);
        ++l;
    }
    while(r < right.length){
        newArr.push(right[r]);
        ++r;
    }
    return newArr;
}

let arr1 = [1,3,5];
let arr2 = [2,4,6];

console.log(merge(arr1));*/

//4
/*function bin(arr, target){
    let start = 0;
    let end = arr.length - 1;
    while(start <= end){
        let mid = Math.floor((end - start) / 2 + start);

        if(arr[mid] === target) return mid;
        if(arr[mid] < target){
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    return -1;
}

let arr = [1,3,5,7,9,11];
let target = 9;

console.log(bin(arr,target));
*/


//5
/*function foo(arr, target){
    for(let i = 0; i < arr.length; ++i){
        if(arr[i] === target){
            return i;
        }
    }
    return - 1;
}

let arr = [1,2,2,2,3,4];
let target = 2;

console.log(foo(arr, target));
*/
/*function foo(arr, target){
    let count = 0;
    for(let i = 0; i < arr.length; ++i){
        if(arr[i] === target){
            ++count;
        }
    }
    return count;
}

let arr = [1,2,2,2,3,4];
let target = 2;
console.log(foo(arr,target));*/
/*
function mergSort(arr){
    if(arr.length === 1) return arr;

    let mid = Math.floor(arr.length / 2);
    let left = mergSort(arr.slice(0, mid));
    let right = mergSort(arr.slice(mid));

    return sort(left, right);

}

function sort(left, right){
    let l = 0;
    let r = 0;
    let newArr = [];

    while(l < left.length && r < right.length){
        if(left[l] < right[r]){
            newArr.push(left[l]);
            ++l;
        } else {
            newArr.push(right[r]);
            ++r;
        }
    }
    while(l < left.length){
        newArr.push(left[l]);
        ++l;
    } 
    while(r < right.length){
        newArr.push(right[r]);
        ++r;
    }
    return newArr;
}

let arr = [38,27,43,3,9,82,10];

console.log(mergSort(arr));*/

/*function quickSort(arr){
    if(arr.length <= 1) return arr;
    let pivotIndex = Math.floor(arr.length / 2);
    let pivot = arr[pivotIndex];
    let left = [];
    let right = [];

    for(let i = 0; i < arr.length; ++i){
        if(i === pivotIndex) continue;
        if(arr[i] < pivot){
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return [ 
        ...quickSort(left),
        pivot,
        ...quickSort(right)
    ]
}

let arr = [1,3,2,4,5,6,6,7,8];
console.log(quickSort(arr));
*/
/*function foo(arr, target){
    let l = 0;
    let r = arr.length - 1;
    while(l <= r){
        let sum = arr[l] + arr[r];
        if(sum === target){
            return [l, r];
        }else if(sum < target){
            ++l;
        } else {
            --r;
        }
    }
    return -1;
}

let arr = [1,2,3,4,6];
let target = 7;
console.log(foo(arr, target));
*/

function foo(arr){
    let newArr = [];
    for(let i = 0; i < arr.length; ++i){
        let sum = arr[i] * arr[i];
        if(sum > arr[i - 1]){
            newArr.push(sum);
        } else {
            newArr.shift(sum);
        }
        
    }
    return newArr;
}

let arr = [-4, -1, 0, 3, 10];
console.log(foo(arr));

