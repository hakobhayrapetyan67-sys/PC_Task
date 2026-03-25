Function.prototype.myApply = function(drsiObj, arg){
	drsiObj = drsiObj || globalThis;

	const key = Symbol();
	drsiObj[key] = this;

	let result;
	
	if(!arg){
		result = drsiObj[key]();
	} else{
		result = drsiObj[key](...arg);
	}
	delete drsiObj[key];
	
	return result;
}

function foo(city, country){
	return `${this.name} leves in ${city}, ${country}`;
}

const user = {name : "Hakob"};

console.log(foo.myApply(null,["Yerevan", "Armenia"])); // globalThisum enq man galis name
console.log(foo.myApply(user,["Yerevan", "Armenia"])); // user_i mej enq man galis name property
