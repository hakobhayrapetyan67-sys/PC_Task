function myEvery(array, callback){
    for(let i = 0; i < array.length; i++){
        if(!callback(array[i], i, array)){
            return false;
        }
    }
    return true;
}
let arr = [1,3,5,6];

console.log(
    myEvery(arr, v => v % 2 === 0)
);