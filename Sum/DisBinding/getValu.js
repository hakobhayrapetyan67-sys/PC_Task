const obj1 ={
	value: 10,
	getValue(){
		return this.value;
	}
}
const obj2 = {
	value: 50
}

console.log(obj1.getValue.call(obj2));
