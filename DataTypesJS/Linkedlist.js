class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    #head;
    #size;

    constructor() {
        this.#head = null;
        this.#size = 0;
    }

    isEmpty() {
        return this.#head === null;
    }

    size() {
        return this.#size;
    }

    front() {
        if (this.isEmpty()) {
            throw new Error("List is empty");
        }

        return this.#head.value;
    }

    back() {
        if (this.isEmpty()) {
            throw new Error("List is empty");
        }

        let curr = this.#head;

        while (curr.next) {
            curr = curr.next;
        }

        return curr.value;
    }

    at(index) {
        if (!Number.isInteger(index) || index < 0 || index >= this.#size) {
            throw new Error("Invalid index");
        }

        let curr = this.#head;

        while (index > 0) {
            curr = curr.next;
            index--;
        }

        return curr.value;
    }

    pushFront(value) {
        const newNode = new Node(value);

        newNode.next = this.#head;
        this.#head = newNode;

        this.#size++;
    }

    pushBack(value) {
        const newNode = new Node(value);

        if (this.isEmpty()) {
            this.#head = newNode;
            this.#size++;
            return;
        }

        let curr = this.#head;

        while (curr.next) {
            curr = curr.next;
        }

        curr.next = newNode;
        this.#size++;
    }

    popFront() {
        if (this.isEmpty()) {
            throw new Error("List is empty");
        }

        const value = this.#head.value;

        this.#head = this.#head.next;
        this.#size--;

        return value;
    }

    popBack() {
        if (this.isEmpty()) {
            throw new Error("List is empty");
        }

        if (this.#head.next === null) {
            const value = this.#head.value;

            this.#head = null;
            this.#size--;

            return value;
        }

        let curr = this.#head;

        while (curr.next.next) {
            curr = curr.next;
        }

        const value = curr.next.value;

        curr.next = null;
        this.#size--;

        return value;
    }

    clear() {
        this.#head = null;
        this.#size = 0;
    }

    toArray() {
        const arr = [];

        let curr = this.#head;

        while (curr) {
            arr.push(curr.value);
            curr = curr.next;
        }

        return arr;
    }

    insert(index, value) {
        if (!Number.isInteger(index) || index < 0 || index > this.#size) {
            throw new Error("Invalid index");
        }

        if (index === 0) {
            this.pushFront(value);
            return;
        }

        if (index === this.#size) {
            this.pushBack(value);
            return;
        }

        let curr = this.#head;

        while (index > 1) {
            curr = curr.next;
            index--;
        }

        const newNode = new Node(value);

        newNode.next = curr.next;
        curr.next = newNode;

        this.#size++;
    }

    erase(index) {
        if (!Number.isInteger(index) || index < 0 || index >= this.#size) {
            throw new Error("Invalid index");
        }

        if (index === 0) {
            return this.popFront();
        }

        let curr = this.#head;

        while (index > 1) {
            curr = curr.next;
            index--;
        }

        const value = curr.next.value;

        curr.next = curr.next.next;
        this.#size--;

        return value;
    }

    reverse() {
        let prev = null;
        let curr = this.#head;

        while (curr) {
            const next = curr.next;

            curr.next = prev;

            prev = curr;
            curr = next;
        }

        this.#head = prev;
    }

    *[Symbol.iterator]() {
        let curr = this.#head;

        while (curr) {
            yield curr.value;
            curr = curr.next;
        }
    }
}