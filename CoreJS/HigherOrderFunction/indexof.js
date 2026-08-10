function myIndexOf(array, searchElement){
    for(let i = 0; i < array.length; i++){
        if(array[i] === searchElement){
            return i;
        }
    }
    return -1;
}
let arr = [5,7,9,11];


console.log(myIndexOf(arr, 9));