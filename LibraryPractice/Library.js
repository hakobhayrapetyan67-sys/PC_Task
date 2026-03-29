const Book = require('./Book');

function Library(name){
	this.name = name;
	this.books = [];
}

//add
Library.prototype.myAdd = function(book){
	if(!book.id || !book.title || !book.author){
		console.log("invalid book");
		return;
	}

	let exists = this.books.some(b => b.id === book.id);
	if(exists) {
		console.log("id ov girq ka urish id dir");
		return;
	}
	
	this.books.push(book);
}

//title
Library.prototype.myTitle = function(title){
	let exists = this.books.find(b => b.title === title);
	if(!exists){
		console.log("girqy chi gtnve");
	}
	return exists;
}	

//author
Library.prototype.myAuthor = function(author){
	let exists = this.books.filter(b => b.author === author);
	if(exists.length === 0){
		console.log("hexinakov girqn chka");
	}		
	return exists;
}

//brrow
Library.prototype.liBrrow = function(id){
	let exists = this.books.find(b => b.id === id);
	if(!exists){
		console.log("girqy chi gtnvel");
		return;
	}

	if(!exists.isAvailable){
		console.log("book already brrowed");
		return;
	}
	exists.isAvailable = false;
}	

//available books
Library.prototype.listAvailable = function(){
	return this.books.filter(b => b.isAvailable);
}	

//brrowed books
Library.prototype.liBrroe = function(){
	return this.books.filter(b => !b.isAvailable);
}
	
module.exports = Library;


	






