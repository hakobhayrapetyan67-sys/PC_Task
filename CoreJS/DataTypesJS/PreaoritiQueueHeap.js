class BinaryHeap{
    #heap;
    constructor(){
        this.#heap = [];
    }
    #parent(index){
        return Math.floor((index - 1) / 2);
    }
    #left(index){
        return index * 2 + 1;
    }
    #right(index){
        return index * 2 + 2;
    }
    #shiftUp(index){
        let elem = this.#heap[index];
        while(true){
            const parentIdx = this.#parent(index);
            if(this.#heap[parentIdx] > elem){
                [this.#heap[parentIdx], this.#heap[index]] = [this.#heap[index], this.#heap[parentIdx]];
                index = parentIdx;
            } else {
                break;
            }
        }
    }
    #shiftDown(index){

    }
    size(){
        return this.#heap.length;
    }
    isEmpty(){
        return this.size() === 0;
    }
    clear(){
        this.#heap = [];
    }
    priorityElement(){
        return this.#heap[0];
    }
    dequ(){
        const res = this.priorityElement();
        this.#heap[0] = this.#heap.pop();
        this.#shiftDown();
        return res;
    }
    enqu(value){
        this.#heap[this.size()] = value;
        this.#shiftUp(this.size() - 1);

    }
}