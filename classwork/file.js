function Library(name){
	tis.name = name;
	this.books = [];
}

Library.prototype.myAdd = function(book){
	if(!book.id || !book.title. || !book.author){
		console.log("invalide value");
		return;
	}

	const exists = this.books.some(b => b.id === book.id);
	if(
}



