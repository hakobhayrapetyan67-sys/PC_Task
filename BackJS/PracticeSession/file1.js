const fs = require('node:fs');


function caesarCipher(filePath, shift) {
  const buf = fs.readFileSync(filePath);
  const result = Buffer.alloc(buf.length);

  for (let i = 0; i < buf.length; ++i) {
    let char = buf[i];

    if (char >= 65 && char <= 90) {
      result[i] = ((char - 65 + shift) % 26 + 26) % 26 + 65;
    } else if (char >= 97 && char <= 122) {
      result[i] = ((char - 97 + shift) % 26 + 26) % 26 + 97;
    } else {
      result[i] = char;
    }
  }
  return result;
}


const encrypted = caesarCipher('./file1.txt', 3);
console.log(encrypted.toString());