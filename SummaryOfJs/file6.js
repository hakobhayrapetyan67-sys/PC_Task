function intersection(set1, set2) {
  const result = new Set();
  for (let item of set1) {
    if (set2.has(item)) result.add(item);
  }
  return result;
}

function difference(set1, set2) {
  const result = new Set();
  for (let item of set1) {
    if (!set2.has(item)) result.add(item);
  }
  return result;
}

// Input
const setA = new Set(['reading', 'games', 'music']);
const setB = new Set(['games', 'sports']);

// Expected Output
 console.log(intersection(setA, setB)); 
// Set(1) { 'games' }

 console.log(difference(setA, setB)); 
// Set(2) { 'reading', 'music' }
