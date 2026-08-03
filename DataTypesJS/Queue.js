class Queue {
    #arr;
    #size;
    #capacity;
    #front;
    #back;

    constructor(capacity = 8) {
        if (!Number.isInteger(capacity))
            throw new Error("Capacity must be integer");

        if (capacity <= 0)
            throw new Error("Capacity must be positive");

        this.#capacity = capacity;
        this.#size = 0;
        this.#front = 0;
        this.#back = 0;
        this.#arr = new Array(capacity);
    }

    size() {
        return this.#size;
    }

    capacity() {
        return this.#capacity;
    }

    isEmpty() {
        return this.#size === 0;
    }

    isFull() {
        return this.#size === this.#capacity;
    }

    enqueue(value) {
        if (this.isFull())
            throw new Error("Queue is full");

        this.#arr[this.#back] = value;

        this.#back = (this.#back + 1) % this.#capacity;

        ++this.#size;
    }

    dequeue() {
        if (this.isEmpty())
            throw new Error("Queue is empty");

        const value = this.#arr[this.#front];

        this.#arr[this.#front] = undefined;

        this.#front = (this.#front + 1) % this.#capacity;

        --this.#size;

        return value;
    }

    front() {
        if (this.isEmpty())
            throw new Error("Queue is empty");

        return this.#arr[this.#front];
    }

    back() {
        if (this.isEmpty())
            throw new Error("Queue is empty");

        let index = (this.#back - 1 + this.#capacity) % this.#capacity;

        return this.#arr[index];
    }

    clear() {
        for (let i = 0; i < this.#capacity; ++i) {
            this.#arr[i] = undefined;
        }

        this.#size = 0;
        this.#front = 0;
        this.#back = 0;
    }

    toArray() {
        const tmp = new Array(this.#size);

        for (let i = 0; i < this.#size; ++i) {
            tmp[i] = this.#arr[(this.#front + i) % this.#capacity];
        }

        return tmp;
    }
}
