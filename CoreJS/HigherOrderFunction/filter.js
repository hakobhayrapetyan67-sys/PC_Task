function myFilter(array, callback){
    let result = [];

    for(let i = 0; i < array.length; ++i){
            if(callback(array[i], i , array)){
                    result.push(array[i]);
            }
    }
    return result;
}

let arr = [1,2,3,4];
let x = myFilter(arr, function (x){
    return x % 2 === 0;
});

console.log(x);
