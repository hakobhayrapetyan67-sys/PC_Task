class MyArr {
    constructor() {
        this.arr = [];
        this.size = 0;
    }

    length() {
        return this.size;
    }

    get(index) {
        if (index < 0 || index >= this.size) {
            throw new Error("Index out of bounds");
        }

        return this.arr[index];
    }

    set(index, value) {
        if (index < 0 || index >= this.size) {
            throw new Error("Index out of bounds");
        }

        this.arr[index] = value;
    }

    push(value) {
        this.arr[this.size] = value;
        this.size++;
    }

    pop() {
        if (this.isEmpty()) {
            throw new Error("Array is empty");
        }

        const value = this.arr[this.size - 1];
        this.arr[this.size - 1] = undefined;
        this.size--;

        return value;
    }

    front() {
        if (this.isEmpty()) {
            throw new Error("Array is empty");
        }

        return this.arr[0];
    }

    back() {
        if (this.isEmpty()) {
            throw new Error("Array is empty");
        }

        return this.arr[this.size - 1];
    }

    isEmpty() {
        return this.size === 0;
    }

    clear() {
        for (let i = 0; i < this.size; i++) {
            this.arr[i] = undefined;
        }

        this.size = 0;
    }

    insert(index, value) {
        if (index < 0 || index > this.size) {
            throw new Error("Index out of bounds");
        }

        for (let i = this.size - 1; i >= index; i--) {
            this.arr[i + 1] = this.arr[i];
        }

        this.arr[index] = value;
        this.size++;
    }

    erase(index) {
        if (index < 0 || index >= this.size) {
            throw new Error("Index out of bounds");
        }

        for (let i = index; i < this.size - 1; i++) {
            this.arr[i] = this.arr[i + 1];
        }

        this.arr[this.size - 1] = undefined;
        this.size--;
    }

    find(value) {
        for (let i = 0; i < this.size; i++) {
            if (this.arr[i] === value) {
                return i;
            }
        }

        return -1;
    }

    reverse() {
        const newArr = new Array(this.size);

        let j = 0;

        for (let i = this.size - 1; i >= 0; i--) {
            newArr[j++] = this.arr[i];
        }

        return newArr;
    }

    print() {
        let str = "[";

        for (let i = 0; i < this.size; i++) {
            str += this.arr[i];

            if (i !== this.size - 1) {
                str += ", ";
            }
        }

        str += "]";

        console.log(str);
    }
}