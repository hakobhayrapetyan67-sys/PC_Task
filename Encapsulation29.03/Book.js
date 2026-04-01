class Book {
    #title;
    #author;
    #year;
    #isAvailable;

    constructor(title, author, year) {
        if (!title) throw new Error("Title required");
        if (!author) throw new Error("Author required");
        if (typeof year !== "number" || year <= 0) {
            throw new Error("Invalid year");
        }

        this.#title = title;
        this.#author = author;
        this.#year = year;
        this.#isAvailable = true;
    }

    // Title
    get title() {
        return this.#title;
    }

    set title(value) {
        if (!value) throw new Error("Title cannot be empty");
        this.#title = value;
    }

    // Author
    get author() {
        return this.#author;
    }

    set author(value) {
        if (!value) throw new Error("Author cannot be empty");
        this.#author = value;
    }

    // Year
    get year() {
        return this.#year;
    }

    set year(value) {
        if (typeof value !== "number" || value <= 0) {
            throw new Error("Invalid year");
        }
        this.#year = value;
    }

    // isAvailable
    get isAvailable() {
        return this.#isAvailable;
    }

    // methods
    borrowBook() {
        if (!this.#isAvailable) {
            return "Book is already borrowed";
        }
        this.#isAvailable = false;
    }

    returnBook() {
        if (this.#isAvailable) {
            return "Book is already available";
        }
        this.#isAvailable = true;
    }

    matchesTitle(word) {
        return this.#title.includes(word);
    }

    getInfo() {
        return `${this.#title} by ${this.#author} (${this.#year}) - ${
            this.#isAvailable ? "Available" : "Borrowed"
        }`;
    }
}

odule.exports = Book;
