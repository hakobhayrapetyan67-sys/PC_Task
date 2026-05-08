const cache = new WeakMap();

function heavyCalc(obj) {
  if (cache.has(obj)) return cache.get(obj);
  
  // Արհեստական դանդաղեցում
  for(let i = 0; i < 1e7; i++) {} 
  
  const result = obj.value * 10; // Պայմանական հաշվարկ
  cache.set(obj, result);
  return result;
}
// Input
const dataObj = { value: 10 };

// Expected Output
 console.log(heavyCalc(dataObj)); 
// (Script pauses for 1-2 seconds...) -> 100

 console.log(heavyCalc(dataObj)); 
// (Returns instantly) -> 100
