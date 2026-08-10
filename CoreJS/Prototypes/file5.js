Array.prototype.mySum = function () {
  let sum = 0;

  for (let i = 0; i < this.length; i++) {
    const current = this[i];

    if (typeof current !== "number" || Number.isNaN(current)) {
      throw new Error("Array contains non-numeric elements");
    }

    sum += current;
  }

  return sum;
};


console.log([1, 2, 3].mySum());    // 6
console.log([10, -5, 4].mySum());  // 9
console.log([].mySum());           // 0


try {
  console.log([1, "2", 3].mySum()); // Error 
} catch (e) {
  console.log("Error caught: " + e.message);
}

try {
  console.log([1, NaN].mySum());    // Error 
} catch (e) {
  console.log("Error caught: " + e.message);
}

try {
  console.log([true, 2].mySum());   // Error 
} catch (e) {
  console.log("Error caught: " + e.message);
}
