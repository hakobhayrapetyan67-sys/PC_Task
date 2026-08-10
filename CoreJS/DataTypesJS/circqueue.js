class CircularQueue {
    #arr;
    #front;
    #rear;
    #size;
    #capacity;
    constructor(capacity = 8){
        if(!Number.isInteger(capacity) || capacity <= 0) throw new Error("sxal");
        this.#arr = new Array(capacity);
        this.#size = 0;
        this.#capacity = capacity;
        this.#front = 0;
        this.#rear = 0;
    }
    enqueue(value){
        if(this.#size === this.#capacity) throw new Error("sxal ka");
        this.#arr[this.#rear] = value; 
        ++this.#size;
        this.#rear = (this.#rear + 1) % this.#capacity;
    }
    dequeue(){
        if(this.#size <= 0) throw new Error("sxal");
        let x = this.#arr[this.#front];
        this.#front = (this.#front + 1) % this.#capacity;
        --this.#size;
        return x;
    }
    front(){
        if(this.#size === 0) throw new Error("sxal");
       
        return this.#arr[this.#front];
    }
    back(){
        if(this.#size === 0) throw new Error("sxal");

      let index = (this.#rear - 1 + this.#capacity) % this.#capacity;
      return this.#arr[index];
    }
    isEmpty(){
        return this.#size === 0;
    }
    isFull(){
       return this.#size === this.#capacity
    }
    size(){
        return this.#size;
    }
    clear(){
        if(this.#size === 0) throw new Error("arten datarka");
        
        this.#size = 0;
        this.#rear = 0;
        this.#front = 0;
    }
}