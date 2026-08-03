function mergSort(arr){
    if(arr.length === 1){
        return arr;
    }

    let mid = Math.floor(arr.length / 2); 
    let left = mergSort(arr.slice(0, mid));
    let right = mergSort(arr.slice(mid));

    return sort(left, right);
}

function sort(left, right){
    let i = 0;
    let j = 0;
    let newArr = [];

    while(i < left.length && j < right.length){
        if(left[i] < right[j]){
            newArr.push(left[i]);
            ++i;
        } else{
            newArr.push(right[j]);
            ++j;
        }
    }    
    while(i < left.length){
        newArr.push(left[i]);
        ++i;
    }

    while(j < right.length){
        newArr.push(right[j]);
        ++j;
    }
    return newArr;

}



let arr = [1,3,2,5,4];

console.log(mergSort(arr));

