function mySelection(arr){
    for(let i = 0; i < arr.length; ++i){
        let minIndx = i;
        for(let j = i + 1; j < arr.length; ++j){
            if(arr[j] < arr[minIndx]){
                minIndx = j;
            }
        }
        [arr[minIndx], arr[i]] = [arr[i], arr[minIndx]];
    }
    return arr;
}

let arr = [12, 64, 8, 3, 6, 81, 5];
console.log(mySelection(arr));

