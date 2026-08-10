const Book = require('./Book');
class Library {
    #books;
    constructor() {
        this.#books = [];
    }

    addBook(book) {
        this.#books.push(book);
    }

    removeBook(title) {
        this.#books = this.#books.filter(b => b.title !== title);
    }

    findBookByTitle(title) {
        return this.#books.find(b => b.title === title) || null;
    }

    findBooksByAuthor(authorName) {
        return this.#books.filter(b => b.author === authorName);
    }

    getAvailableBooks() {
        return this.#books.filter(b => b.isAvailable);
    }

    borrowBook(title) {
        let book = this.findBookByTitle(title);
        if (!book) return "girqy chka";
	return book.borrowBook();

    }

    returnBook(title) {
        let book = this.findBookByTitle(title);
        if (!book) return "girqy chka";
       	return book.returnBook();
    }

    showAllBooks() {
        console.log(this.#books.map(b => b.getInfo()));
    }

    getOldestBook() {
        if (this.#books.length === 0) return null;
        return [...this.#books].sort((a, b) => a.year - b.year)[0];
    }

    countBooks() { return this.#books.length; }

    countAvailableBooks() {
        return this.getAvailableBooks().length;
    }

    searchBooks(word) {
        const searchWord = word.toLowerCase();
        return this.#books.filter(book => 
            book.matchesTitle(searchWord) || book.matchesAuthor(searchWord)
        );
    }
}
module.exports = Library;
