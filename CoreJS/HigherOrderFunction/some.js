function mySome(array, callback){
    for(let i = 0; i < array.length; i++){
        if(callback(array[i], i, array)){
            return true;
        }
    }
    return false;
}
let arr = [1,3,5,6];

console.log(
    mySome(arr, v => v % 2 === 0)
);