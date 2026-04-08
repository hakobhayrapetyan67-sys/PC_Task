const obj = {
	value: 1,
	add(x){
		return this.value += x;
	}
};
obj.add(5);
console.log(obj.add(10));
