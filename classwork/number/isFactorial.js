function isFact(n) {
    let a = 1;
    while (n != 0) {
        a *= n;
        n -= 1;
    }
    return a;
}

let z = 5;
let y = 7;
console.log(isFact(z)); // 120
console.log(isFact(y)); // 5040
