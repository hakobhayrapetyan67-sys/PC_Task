~                                                                                                
"Book.js" 15L, 335B
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
// arajin mas ////////////
const Book = require('./Book');

function Library(name){
        this.name = name;
        this.books = [];
}

//add
Library.prototype.myAdd = function(book){
        if(!book.id || !book.title || !book.author){
                console.log("invalid book");
                return;
        }

        let exists = this.books.some(b => b.id === book.id);
        if(exists) {
                console.log("id ov girq ka urish id dir");
                return;
        }

        this.books.push(book);
}

//title
Library.prototype.myTitle = function(title){
        let exists = this.books.find(b => b.title === title);
        if(!exists){
                console.log("girqy chi gtnve");
        }
        return exists;
}

//author
Library.prototype.myAuthor = function(author){
        let exists = this.books.filter(b => b.author === author);
        if(exists.length === 0){
                console.log("hexinakov girqn chka");
        }
        return exists;
}

//brrow
Library.prototype.liBrrow = function(id){
        let exists = this.books.find(b => b.id === id);
        if(!exists){
                console.log("girqy chi gtnvel");
                return;
        }

        if(!exists.isAvailable){
                console.log("book already brrowed");
                return;
        }
        exists.isAvailable = false;
}

//available books
Library.prototype.listAvailable = function(){
        return this.books.filter(b => b.isAvailable);
}

//brrowed books
Library.prototype.liBrroe = function(){
        return this.books.filter(b => !b.isAvailable);
}

module.exports = Library;
// 2 mass ///////////////////
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
~                                               
// 3 verj
