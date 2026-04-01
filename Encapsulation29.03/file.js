class Book {
	#title;
	#year;
	#author;
	#isAvaible;

	constructor(title, year, author){
		if(!title) throw new Error("sxal");
		if(typeof year !== "number") throw new Erro("sxal");
		if(!author) throw new Error("sxal");

		this.#title = title;
		this.#year = year;
		this.#author = author;
		this.#isAvaible = true;
	}

	get title(){
		return this.#title;
	}
	set title(value){
		if(!value) return "sxal ka";
		this.#title = value;
	}
	
	get year(){
		return this.#year;
	}
	set year(value){
		if(!value) return "sxal ka";
		this.#year = value;
	}	
	
	get author(){
		return this.#author;
	}
	set author(value){
		if(!value) return "sxal ka";
		this.#author = value;
	}

	get isAvaible(){
		return this.#isAvaible;
	}
	
	borrowBook(){
		if(!this.#isAvaible) return "sxal ka";
		this.#isAvaible = false;
		
	}	
	
	returnB(){
		if(this.#isAvaible) return "sxal ka";

		this.#isAvaible = true;
	}
	metchesYiyle(word){
		return this.#title.includes(word);
	}
}

class Reader{
	#name;
	#borrowedBooks;

	constructor(name){
		if(!name) throw new Error("Sxal ka");

		this.#name = name;
		this.#borrowedBooks = [];
	}

	get borroedBooksCount(){
		return this.#borrowedBooks.length;
	}

	takeBook(book){
		if(!book.isAvaible) return "girqn vercuksa";
		this.#borrowedBooks.push(book);	
		book.borrowBook();
	}
	returnBook(book){
		this.#borrowedBooks = this.#borrowedBooks.filter(b => b !== book);        book.returnB();
	}	

	hasBook(book){
		return this.#borrowedBooks.includes(book);
	}
	titleCount(){
		return this.#borrowedBooks.map(b => b.title);
	}
}

class Library {
	#name;
	#books;
	#readers;

	constructor(name){
		this.#name = name;
		this.#books = [];
		this.#readers = [];
	}

	retBook(book){
		return this.#books.push(book);
	}
	registerRead(reader){
		return this.#readers.push(reader);
	}
	findBook(title){
		return this.#books.find(b => b.title === title) || null;
	}

	giveBook(title, reader){
		let book = this.findBook(title);
		if(!book) return "sxal ka";

		reader.takeBook(book);
	}
	
	retBook(title, reader){
		let book = this.findBook(title);
		if(!book) return "sxal ka";

		reader.returnBook(book);
	}

	fooBooks(){
		return this.#books.filter(b => b.isAvaible);
	}

}


const myLibrary = new Library("kentronakan gradaran");

const book1 = new Book("Js", 2008, "Armen");
const book2 = newBook("Py", 2020, "Anna");

myLibrary.addBook(book1);
myLibrary.AddBook(book2);

const reader1 = new Reader("Armen");
myLibrary.registerRead(reader1);












