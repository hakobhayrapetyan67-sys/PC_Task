let arr = [{
	name:"A", 
	age: 10  
},
{
	name: "B",	
	age: 15
}
]
function foo(arr){
	let newA = [];
	for(let i of arr){	
		if(i == arr[2].age){
			newA.push(i.age);
		}
	}
	return newA;
}
console.log(foo(arr));
