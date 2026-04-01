class Reader {
    #name;
    #borrowedBooks;

    constructor(name) {
        if (!name) throw new Error("Name required");
        this.#name = name;
        this.#borrowedBooks = [];
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        if (!value) throw new Error("Name cannot be empty");
        this.#name = value;
    }

    get borrowedBooks() {
        return this.#borrowedBooks;
    }

    get borrowedBooksCount() {
        return this.#borrowedBooks.length;
    }

    takeBook(book) {
        if (!book.isAvailable) {
            return "Book not available";
        }

        this.#borrowedBooks.push(book);
        book.borrowBook();
    }

    giveBackBook(book) {
        this.#borrowedBooks = this.#borrowedBooks.filter(b => b !== book);
        book.returnBook();
    }

    hasBook(book) {
        return this.#borrowedBooks.includes(book);
    }

    showBorrowedBooks() {
        return this.#borrowedBooks.map(b => b.title);
    }

    getInfo() {
        return `${this.#name} has ${this.borrowedBooksCount} borrowed books`;
    }
}

module.exports = Reader;
