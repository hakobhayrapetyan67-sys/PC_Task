let obj = {
	x : 10
}

let objCopy = Object.create(obj);
objCopy.y = 20;

console.log(objCopy.x);
console.log(objCopy.y);
