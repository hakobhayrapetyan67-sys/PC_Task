class Book {
    #title;
    #author;
    #year;
    #isAvailable;

    constructor(title, author, year) {
        if (!title || !author || typeof year !== "number") {
            throw new Error("tvyalnern sxal en");
        }
        this.#title = title;
        this.#author = author;
        this.#year = year;
        this.#isAvailable = true;
    }

     
    get title() { return this.#title; }
    get author() { return this.#author; }
    get year() { return this.#year; }
    get isAvailable() { return this.#isAvailable; }
	
	get isAvailable(){
		return this.#isAvailable;
	}	
	
    getInfo() {
        return `${this.#title} - ${this.#author} (${this.#year})`;
    }

    borrowBook() {
        if (!this.#isAvailable) return("girqy zbaxvac e");
        this.#isAvailable = false;
    }

    returnBook() {
        if (this.#isAvailable)return("girqn arden ka");
        this.#isAvailable = true;
    }

    matchesAuthor(authorName) {
        return this.#author.toLowerCase().includes(authorName.toLowerCase());
    }

    matchesTitle(word) {
        return this.#title.toLowerCase().includes(word.toLowerCase());
    }
}

module.exports = Book;
