class Product{
	constructor(price){
		this.price = price;
	}
	getInfo(){
		return (this.price * 10) / 100;
	}
}

const pr = new Product(100);
let n = 100 - pr.getInfo() ;
console.log(n);
