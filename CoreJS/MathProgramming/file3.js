const OddValidator = {};

Object.defineProperty(OddValidator, Symbol.hasInstance, {
	value: function(instance){
		if(typeof instance !== 'number') return false;

		return instance % 2 !== 0;
	}
});

console.log(5 instanceof OddValidator);
console.log(10 instanceof OddValidator);
console.log("7" instanceof OddValidator);


