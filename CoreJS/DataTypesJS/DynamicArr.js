class DynamicArray {
    constructor(capacity = 8) {
        this.arr = new Array(capacity);
        this._size = 0;
        this._capacity = capacity;
    }

    size() {
        return this._size;
    }

    capacity() {
        return this._capacity;
    }

    resize(newCapacity = this._capacity * 2) {
        let newArr = new Array(newCapacity);

        for (let i = 0; i < this._size; i++) {
            newArr[i] = this.arr[i];
        }

        this.arr = newArr;
        this._capacity = newCapacity;
    }


    pushBack(value) {

        if (this._size === this._capacity) {
            this.resize();
        }

        this.arr[this._size] = value;
        this._size++;
    }


    popBack() {

        if (this._size === 0) {
            throw new Error("Array is empty");
        }

        let value = this.arr[this._size - 1];

        this.arr[this._size - 1] = undefined;

        this._size--;

        return value;
    }


    front() {

        if (this._size === 0) {
            throw new Error("Array is empty");
        }

        return this.arr[0];
    }


    back() {

        if (this._size === 0) {
            throw new Error("Array is empty");
        }

        return this.arr[this._size - 1];
    }


    get(index) {

        if (index < 0 || index >= this._size) {
            throw new Error("Index out of range");
        }

        return this.arr[index];
    }


    set(index, value) {

        if (index < 0 || index >= this._size) {
            throw new Error("Index out of range");
        }

        this.arr[index] = value;
    }


    insert(index, value) {

        if (index < 0 || index > this._size) {
            throw new Error("Index out of range");
        }


        if (this._size === this._capacity) {
            this.resize();
        }


        for (let i = this._size; i > index; i--) {
            this.arr[i] = this.arr[i - 1];
        }


        this.arr[index] = value;
        this._size++;
    }


    remove(index) {

        if (index < 0 || index >= this._size) {
            throw new Error("Index out of range");
        }


        let value = this.arr[index];


        for (let i = index; i < this._size - 1; i++) {
            this.arr[i] = this.arr[i + 1];
        }


        this.arr[this._size - 1] = undefined;

        this._size--;

        return value;
    }


    clear() {

        this.arr = new Array(this._capacity);
        this._size = 0;
    }


    isEmpty() {

        return this._size === 0;
    }


    contains(value) {

        for (let i = 0; i < this._size; i++) {

            if (this.arr[i] === value) {
                return true;
            }
        }

        return false;
    }


    indexOf(value) {

        for (let i = 0; i < this._size; i++) {

            if (this.arr[i] === value) {
                return i;
            }
        }

        return -1;
    }


    shrinkToFit() {

        if (this._size < this._capacity) {

            let newArr = new Array(this._size);


            for (let i = 0; i < this._size; i++) {
                newArr[i] = this.arr[i];
            }


            this.arr = newArr;
            this._capacity = this._size;
        }
    }


    reverse() {

        let left = 0;
        let right = this._size - 1;


        while (left < right) {

            let temp = this.arr[left];

            this.arr[left] = this.arr[right];

            this.arr[right] = temp;


            left++;
            right--;
        }
    }


    print() {

        console.log(this.arr.slice(0, this._size));

        console.log(
            "Size:",
            this._size,
            "Capacity:",
            this._capacity
        );
    }
}
const arr = new DynamicArray(2);


arr.pushBack(10);
arr.pushBack(20);
arr.pushBack(30);


arr.print();
