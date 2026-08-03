class Stack{
    constructor(){
        this.arr = [];
        this.count = 0;
    }
    push(value){
        this.arr[this.count] = value;
        ++this.count;
    }
    pop(){
        if(this.count === 0) return null;

        const val = this.arr[this.count - 1];
        this.arr[this.count - 1] = undefined;
        this.count--;
        return val;
        ;
    }
    peek(){
        if(this.count === 0) return null;
        return this.arr[this.count - 1];
    }
    isEmpty(){
        return this.count === 0;
    }
    size(){
        return this.count;
    }
    clear(){
        this.arr = [];
        this.count = 0;
    }
}
const stack = new Stack();

stack.push(10);
stack.push(20);
stack.push(30);

console.log(stack.peek());      // 30
console.log(stack.size());      // 3

console.log(stack.pop());       // 30
console.log(stack.pop());       // 20

console.log(stack.peek());      // 10
console.log(stack.size());      // 1

console.log(stack.isEmpty());   // false

stack.clear();

console.log(stack.isEmpty());   // true
console.log(stack.pop());       // null:wq

