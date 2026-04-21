const myRange = {
	from: 1,
	to: 5,
	[Symbol.iterator](){
		let current = this.to;
		return {
			next: () => {
				if(current >= this.from){
					return {value: current --, done: false};
				}
				return {done: true};	
			}
		}
	}
}
console.log([...myRange]);
