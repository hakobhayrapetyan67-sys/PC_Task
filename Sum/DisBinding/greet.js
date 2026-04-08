const user = {
	name: "Alex",
	greet(){
		return "Hello " + this.name;
	}
}

const admin = {
	name: "Admin"
};
console.log(user.greet.call(admin));

