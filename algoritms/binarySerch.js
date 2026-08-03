function binarySearch(arr, target){
    let start = 0;
    let end = arr.length - 1;

    while(start <= end){
        let mid = Math.floor((end - start) / 2 + start);
        if(arr[mid] === target) return mid;
        else if(arr[mid] > target){
            end = mid - 1;
        } else{
            start = mid + 1;
        }
    }
    return -1;
}

let arr = [1,2,3,4,5,67,7];
let target = 67;
console.log(binarySearch(arr, target));


