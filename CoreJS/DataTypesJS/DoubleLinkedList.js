class Node {
    constructor(value){
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class LinkedList{
    constructor(){
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    pushBack(value){
        let newNode = new Node(value);

        if(this.size === 0){
            this.head = newNode;
            this.tail = newNode;
            ++this.size;
            return;
        }

        newNode.prev = this.tail;
        this.tail.next = newNode;
        this.tail = newNode;
        ++this.size;
    }

    pushFront(value){
        let newNode = new Node(value);

        if(this.size === 0){
            this.head = newNode;
            this.tail = newNode;
            ++this.size;
            return;
        }

        this.head.prev = newNode;
        newNode.next = this.head;
        this.head = newNode;
        ++this.size;
    }

    popBack(){
        if(this.size === 0){
            throw new Error("List is empty");
        }

        if(this.size === 1){
            this.head = null;
            this.tail = null;
            --this.size;
            return;
        }

        this.tail = this.tail.prev;
        this.tail.next = null;
        --this.size;
    }

    popFront(){
        if(this.size === 0){
            throw new Error("List is empty");
        }

        if(this.size === 1){
            this.head = null;
            this.tail = null;
            --this.size;
            return;
        }

        this.head = this.head.next;
        this.head.prev = null;
        --this.size;
    }

    length(){
        return this.size;
    }

    isEmpty(){
        return this.size === 0;
    }

    front(){
        if(this.size === 0){
            return null;
        }

        return this.head.value;
    }

    back(){
        if(this.size === 0){
            return null;
        }

        return this.tail.value;
    }

    clear(){
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    contains(value){
        if(this.size === 0) return false;;
        let curr = this.head;
        while(curr !== null){
            if(curr.value === value){
                    return true;
            }
            curr = curr.next;
        }
        return false;
    }
    find(value){
        if(this.size === 0) return -1;
        let curr = this.head;
        let count = 0;;
        while(curr !== null){
            if(curr.value === value){
                return count;
            }
            ++count;
            curr = curr.next;
        }
        return -1;
    }
    printForward(){
        if(this.size === 0) return [];
        let curr = this.head;
        let arr = [];
        while(curr !== null){
            arr.push(curr.value);
            curr = curr.next;
        }
        return arr;
    }
    printBackward(){
        if(this.size === 0) return [];
        let curr = this.tail;
        let arr = [];
        while(curr !== null){
            arr.push(curr.value);
            curr = curr.prev;
        }
        return arr;
    }
    insert(index, value) {
        if (index < 0 || index > this.size) {
            throw new Error("Invalid index");
        }

        if (index === 0) {
          this.pushFront(value);
            return;
        }

        if (index === this.size) {
            this.pushBack(value);
            return;
        }

        let newNode = new Node(value);
        let curr = this.head;

        for (let i = 0; i < index; i++) {
        curr = curr.next;
        }

        newNode.next = curr;
        newNode.prev = curr.prev;

        curr.prev.next = newNode;
        curr.prev = newNode;

        ++this.size;
    }
    remove(index) {
        if (index < 0 || index >= this.size) {
            throw new Error("Invalid index");
        }

        if (index === 0) {
            this.popFront();
            return;
        }

        if (index === this.size - 1) {
            this.popBack();
            return;
        }

        let curr = this.head;

        for (let i = 0; i < index; i++) {
             curr = curr.next;
        }

        curr.prev.next = curr.next;
         curr.next.prev = curr.prev;

        --this.size;
    }
    
    reverse(){
        let curr = this.head;
        while(curr !== null){
            let tmp = curr.next;
            curr.next = curr.prev;
            curr.prev = tmp;
            curr = tmp;
        }
        let tmp = this.head;
        this.head = this.tail;
        this.tail = tmp;
    }
}