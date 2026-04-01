let obj1 = {
	name: "hakob",	
	age: 22 
}	

function haseAge(obj){
	return "age" in obj;
}

function haseColor(obj){
	return "color" in obj;
}

console.log(haseAge(obj1));
console.log(haseColor(obj1));
