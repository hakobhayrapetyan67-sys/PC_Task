Function.prototype.myCall = function(drsiObj, ...args) {
	drsiObj = drsiObj || globalthis;

	const key = Symbol();
	drsiObj[key] = this;
		
	const result = drsiObj[key](...args);
	
	delete drsiObj[key];
	
	return result;
};


function showInfo(city, country){
	return `${this.name} libes in ${city}, ${country}`;
}

const user = {name: "joe" };

console.log(showInfo.myCall(user, "Yerevan", "Armenia"));



