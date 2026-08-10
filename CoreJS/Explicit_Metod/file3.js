
const user = {
	name : "Alex",
	greet (){
		return "Hello " + this.name;
	}
};

const admin = {
	name : "Admin"
};

let x = user.greet.call(admin);
console.log(x);
