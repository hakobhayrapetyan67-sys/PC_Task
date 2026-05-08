function filterSpam(text, badWordsArray){
  const badWordsSet = new Set(badWordsArray);
  return text.split(' ').map(word => 
     badWordsSet.has(word.toLowerCase()) ? '**' : word
  ).join(' ');
}

// Input
const text = "buy our new cheap product";
const badWords = ["cheap", "buy"];

// Expected Output
 console.log(filterSpam(text, badWords));
// "*** our new *** product"
