class Library {
    #name;
    #books;
    #readers;

    constructor(name) {
        if (!name) throw new Error("Library name required");

        this.#name = name;
        this.#books = [];
        this.#readers = [];
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        if (!value) throw new Error("Invalid name");
        this.#name = value;
    }

    get books() {
        return this.#books;
    }

    get readers() {
        return this.#readers;
    }

    addBook(book) {
        this.#books.push(book);
    }

    registerReader(reader) {
        this.#readers.push(reader);
    }

    findBookByTitle(title) {
        return this.#books.find(b => b.title === title) || null;
    }

    findBooksByAuthor(author) {
        return this.#books.filter(b => b.author === author);
    }

    giveBookToReader(title, reader) {
        let book = this.findBookByTitle(title);
        if (!book) return "Book not found";

        reader.takeBook(book);
    }

    acceptBookFromReader(title, reader) {
        let book = this.findBookByTitle(title);
        if (!book) return "Book not found";

        reader.giveBackBook(book);
    }

    showAvailableBooks() {
        return this.#books.filter(b => b.isAvailable);
    }

    showAllBooks() {
        return this.#books.map(b => b.getInfo());
    }

    getLibraryInfo() {
        return `${this.#name}: ${this.#books.length} books, ${this.#readers.length} readers`;
    }
}

module.exports = Library;
