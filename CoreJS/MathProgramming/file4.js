const account = {
	balance: 1000,
	currency: "USD",
	[Symbol.toPrimitive](hint){
		console.log(`Hint active: ${hint}`);

		if(hint === 'string'){
			return `Account Balance: ${this.balance} ${this.currency}`;
		}

		return this.balance;
	}
};

console.log(+account);
console.log(String(account));
console.log(account + 50);
