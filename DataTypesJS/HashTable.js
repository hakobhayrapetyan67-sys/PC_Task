class HashTable {
    constructor(capacity = 8) {
        this.capacity = capacity;
        this.size = 0;
        this.buckets = new Array(capacity);
    }

    hash(key) {
        let hash = 0;

        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }

        return hash % this.capacity;
    }

    put(key, value) {
        const index = this.hash(key);

        if (!this.buckets[index]) {
            this.buckets[index] = [];
        }

        const bucket = this.buckets[index];

        // Եթե key-ն արդեն կա, փոխում ենք value-ը
        for (let pair of bucket) {
            if (pair.key === key) {
                pair.value = value;
                return;
            }
        }

        bucket.push({ key, value });
        this.size++;

        if (this.size / this.capacity >= 0.75) {
            this.resize();
        }
    }

    get(key) {
        const index = this.hash(key);
        const bucket = this.buckets[index];

        if (!bucket) return undefined;

        for (let pair of bucket) {
            if (pair.key === key) {
                return pair.value;
            }
        }

        return undefined;
    }

    containsKey(key) {
        return this.get(key) !== undefined;
    }

    remove(key) {
        const index = this.hash(key);
        const bucket = this.buckets[index];

        if (!bucket) return false;

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                bucket.splice(i, 1);
                this.size--;
                return true;
            }
        }

        return false;
    }

    resize() {
        const oldBuckets = this.buckets;

        this.capacity *= 2;
        this.buckets = new Array(this.capacity);
        this.size = 0;

        for (let bucket of oldBuckets) {
            if (!bucket) continue;

            for (let pair of bucket) {
                this.put(pair.key, pair.value);
            }
        }
    }

    clear() {
        this.buckets = new Array(this.capacity);
        this.size = 0;
    }

    isEmpty() {
        return this.size === 0;
    }

    keys() {
        const keys = [];

        for (let bucket of this.buckets) {
            if (!bucket) continue;

            for (let pair of bucket) {
                keys.push(pair.key);
            }
        }

        return keys;
    }

    values() {
        const values = [];

        for (let bucket of this.buckets) {
            if (!bucket) continue;

            for (let pair of bucket) {
                values.push(pair.value);
            }
        }

        return values;
    }

    entries() {
        const entries = [];

        for (let bucket of this.buckets) {
            if (!bucket) continue;

            for (let pair of bucket) {
                entries.push([pair.key, pair.value]);
            }
        }

        return entries;
    }
}

const table = new HashTable();

table.put("Hakob", 20);
table.put("Anna", 25);
table.put("David", 30);

console.log(table.get("Anna")); // 25

table.put("Anna", 100);

console.log(table.get("Anna")); // 100

console.log(table.containsKey("Hakob")); // true

table.remove("David");

console.log(table.keys());
// ["Hakob", "Anna"]

console.log(table.values());
// [20, 100]

console.log(table.entries());
// [
//   ["Hakob",20],
//   ["Anna",100]
// ]