function countt(arr){
    let min = Math.min(...arr);
    let max = Math.max(...arr);
    let reng = max - min + 1;
    let countV = new Array(reng).fill(0);
    let res = [];

    for(let i = 0; i < arr.length; ++i){
        let indx = arr[i] - min;
        ++countV[indx];
    }

    for(let i = 0; i < countV.length; ++i){
        while(countV[i]--){
            res.push(i + min);
        }
    }
    return res;
}

let arr = [1,2,3,4,3,2,1,4,5,262,3,21,321,4];

console.log(countt(arr));

