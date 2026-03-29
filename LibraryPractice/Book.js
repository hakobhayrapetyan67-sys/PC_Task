function Book(id, title, author, year){
	if(!id) throw new Error("Enter id");
	if(!title) throw new Error("Enther title");
	if(!author) throw new Error("Enther author");
	if(typeof year !== "number") throw new Error("enther n");

	this.id = id;
	this.title= title;
	this.author = author;
	this.year = year;
}

module.exports = Book;


