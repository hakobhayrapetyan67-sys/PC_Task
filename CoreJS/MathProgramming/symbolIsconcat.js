let digits = [1,2,3];

let extraNumbers = {
	0: 4,
	1: 5,
	length: 2,
	[Symbol.isConcatSpreadable]: true
}

const bonus = [6, 7];
bonus[Symbol.isConcatSpreadable] = false;

console.log(digits.concat(bonus));
