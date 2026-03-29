const Book = require('./Book');
const Library = require('./Library');

const lib = new Library("City Library");

const book1 = new Book(1, "Js", "John", 2020);
const book2 = new Book(2, "Python Basics", "Anna", 2019);
const book3 = new Book(3, "Advanced Js", "John", 2021);

// add books
lib.myAdd(book1);
lib.myAdd(book2);
lib.myAdd(book3);

// find by title
console.log(lib.myTitle("Python Basics"));

// borrow book
lib.liBrrow(1);
lib.liBrrow(1);

// lists
console.log("Available books:", lib.listAvailable());
console.log("Borrowed books:", lib.liBrroe());
