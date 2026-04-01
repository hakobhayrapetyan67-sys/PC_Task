const Book = require('./Book');
const Library = require('./Library');

const book1 = new Book("Harry Potter", "J. K. Rowling", 1997);
const book2 = new Book("1984", "George Orwell", 1949);
const book3 = new Book("Animal Farm", "George Orwell", 1945);
const book4 = new Book("The Hobbit", "J. R. R. Tolkien", 1937);

const library = new Library();

library.addBook(book1);
library.addBook(book2);
library.addBook(book3);
library.addBook(book4);

console.log("=== All books ===");
library.showAllBooks();

console.log("=== Count books ===");
console.log(library.countBooks()); // 4

console.log("=== Count available books ===");
console.log(library.countAvailableBooks()); // 4

console.log("=== Find by title ===");
console.log(library.findBookByTitle("1984"));

console.log("=== Find by author ===");
console.log(library.findBooksByAuthor("George Orwell"));

console.log("=== Search books ===");
console.log(library.searchBooks("Harry"));

console.log("=== Borrow book ===");
library.borrowBook("1984");
console.log(library.findBookByTitle("1984"));

console.log("=== Borrow same book again ===");
library.borrowBook("1984");

console.log("=== Return book ===");
library.returnBook("1984");
console.log(library.findBookByTitle("1984"));

console.log("=== Available books ===");
console.log(library.getAvailableBooks());

console.log("=== Oldest book ===");
console.log(library.getOldestBook());

console.log("=== Remove book ===");
library.removeBook("The Hobbit");
console.log(library.countBooks()); // 3

console.log("=== Final books ===");
library.showAllBooks();
