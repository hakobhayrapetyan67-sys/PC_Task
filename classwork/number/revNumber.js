function revNumber(n){
	let x = "";
	for(let y = n.length - 1; y >= 0; --y){
		x += n[y];
	}
	return x;
}	

let z = "123";
console.log(revNumber(z));
