class Account{
	constructor(password){
		if(password.length < 6) throw new Error("6simvol");
	this.password = password;
	}
}

let p1 = new Account("1234567");
console.log(p1);
