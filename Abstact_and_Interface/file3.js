class Animal{
	speak(){
		console.log(`Animal makes a sound`);
	}
}

class Dog extends Animal{
	speak(){
		super.speak();
		console.log(`Dog barks`);
	}
}

const d = new Dog();
d.speak();

// Արդյունք՝
// Animal makes a sound
// Dog barks
