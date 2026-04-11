class Shape{
	constructor(){
	
		if(new.target === Shape)throw new Error("sxal");
	}	

	getArea(){
		throw new Erro("method not implemented");
	}
}

class Rectangle extends Shape{
	constructor(width, height){
		super();
		this.width = width;
		this.heigth = heigth;
	}
	getArea(){
		return this.width * this.heigth;
	}
}
class Circle extends Shape{
	constructor(radius){
		super();
		this.radius = radius;
	}
	getArea(){
		return 3.14 * (radius * radius);
	}
}


const shape = new Shape();
// Error: Cannot instantiate abstract class

const rect = new Rectangle(10, 5);
console.log(rect.getArea());
// 50
