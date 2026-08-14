const path = require('path');

function sanitizeFilename(filename){
    const {name, ext} = path.parse(filename);
    const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') 
    .replace(/^-+|-+$/g, '');

    return cleanName + ext.toLowerCase();
}

let filN = "asdf-----wvwev.csS";
console.log(sanitizeFilename(filN));