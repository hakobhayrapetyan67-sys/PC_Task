Function.prototype.myBind = function(drsiObj, ...preArgs){
	const fn = this;

	return function(...latArgs){
		return fn.apply(drsiObj, [...preArgs, ...latArgs]);
	}
};

function info(citi, country){
	return `${this.name} lives in ${citi}, ${country}`;
}
	
const user = {name : "joe"};
const x = info.myBind(user, "Yerevan");
console.log(x("Armenia"));

