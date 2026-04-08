const obj = {
	value: 100,
	get(){
		let inner = () => this.value;
	return inner();
	}
}

console.log(obj.get());
