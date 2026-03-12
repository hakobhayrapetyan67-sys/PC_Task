function myForEach(array, callback){
    for(let i = 0; i < array.length; ++i){
        callback(array[i], i, array);
    }
}

let arr = [10,20,30];
myForEach(arr, function(valu, index){
    console.log(valu, index);
});
