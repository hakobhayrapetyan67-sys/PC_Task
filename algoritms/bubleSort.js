function bubleSort(arr){
    for(let i = 0; i < arr.length; ++i){
        for(let j = 0; j < arr.length - i - 1; ++j){
            if(arr[j] > arr[j + 1]){
                [arr[j], arr[j + 1]] = [arr[j+ 1], arr[j]];
            }
        }
    }
    return arr;
}


let arr = [1,3,2,4,7,5,6];

console.log(bubleSort(arr));