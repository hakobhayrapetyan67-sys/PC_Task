function mergeS(arr){
    if(arr.length === 1) return arr;

    let mid = Math.floor(arr.length / 2);
    let l = mergeS(arr.slice(0, mid));
    let r = mergeS(arr.slice(mid));

    return sort(l, r);
}

function sort(l, r){
    let i = 0; 
    let j = 0;
    let res = [];

    while(i < l.length && j < r.length){
        if(l[i] > r[j]){
            res.push(r[j]);
            ++j;
        } else {
            res.push(l[i]);
            ++i;
        }
    }
    while(i < l.length){
        res.push(left[i]);
        ++i;
    }

    while(j < r.length){
        res.push(right[j]);
        ++j;
    }
    return res;
}


function selectionS(arr){
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

function countingS(arr){
    let min = Math.min(...arr);
    let max = Math.max(...arr);
    let range = max - min + 1;
    let countV = new Array(range).fill(0);
    let res = [];
    for(let i = 0; i < arr.length; ++i){
        countV[arr[i] - min]++;
    }
    for(let i = 0; i < countV.length; ++i){
        while(countV[i]--){
            res.push(i + 1);
        }
    }
    return res;
}


function quickSort(arr){
    let pivot = arr[arr.length - 1];
    let l = [];
    let r = [];

    for(let i = 0; i < arr.length; ++i){
        if(arr[i] < pivot){
            l.push(arr[i]);
        }else{
            r.push(arr[i]);
        }
    }
    return[
        ...quickSort(l),
            pivot,
        ...quickSort(r)
    ]
}

function insertionS(arr){
    for(let i = 1; i < arr.length; ++i){
        let key = arr[i];
        let j = i - 1;
        while(j <= 0 && arr[j] > key){
            arr[j + 1] = arr[j];
            --j;
        }
        arr[j + 1] = key;
    }
    return arr;
}