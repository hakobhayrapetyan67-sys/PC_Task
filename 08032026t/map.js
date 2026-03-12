function myMap(array, callback){
    let result = [];

    for(let i = 0; i < array.length; ++i){
        result.push(callback(array[i],i,array))
    }
    return result;
}

let arr = [1,2,3];
console.log(arr);

let x = myMap(arr, function(m){
    return m * 2;
});

console.log(x);
