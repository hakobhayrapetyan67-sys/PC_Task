class Deque {
    #size;
    #frontBucket;
    #backBucket;
    #frontIdx;
    #backIdx;
    #bucket;
    #bucketLength = 8;

    constructor(bucketSize = 4) {
        if (Number.isSafeInteger(bucketSize) && bucketSize > 4) {
            if (bucketSize % 2 !== 0) {
                this.#init(bucketSize + 1);
                return;
            }
        }
        this.#init(bucketSize);
    }
    #init(bucketSize){
      this.#bucket = new Array(bucketSize);
      for(let i = 0; i < bucketSize; ++i){
        this.#bucket[i] = new Array(this.#bucketLength);
      }
      this.#size = 0;
      let mid = Math.floor(bucketSize / 2);
      this.#backBucket = mid;
      this.#frontBucket = mid - 1;
      this.#backIdx = 0;
      this.#frontIdx = this.#bucketLength - 1;
    }
    pushBack(val){
        this.#bucket[this.#backBucket][this.#backIdx] = val;
        this.#size++;
        this.#backIdx++;
        if(this.#backIdx === this.#bucketLength){
            this.#backIdx = 0;
            this.#backBucket++;
        }
    }
    pushFront(val){
        this.#bucket[this.#frontBucket][this.#frontIdx] = val;
        this.#size++;
        this.#frontIdx--;
        if(this.#frontIdx  < 0){
            this.#frontIdx = this.#bucketLength - 1;
            this.#frontBucket--;
        }
    }
    popBack(){
        if(this.#size === 0) throw new Error("sxal");
        this.#backIdx--;
        if(this.#backIdx < 0){
            this.#backBucket--;
            this.#backIdx = this.#bucketLength - 1;   
        }
        let val = this.#bucket[this.#backBucket][this.#backIdx];
            this.#bucket[this.#backBucket][this.#backIdx] = undefined;
            this.#size--;
            return val;
    }
    popFront(){
        if(this.#size === 0) throw new Error("sxal");
        this.#frontIdx++;
        if(this.#frontIdx === this.#bucketLength){
            this.#frontBucket++;
            this.#frontIdx = 0;
        }
         let val = this.#bucket[this.#frontBucket][this.#frontIdx];
            this.#bucket[this.#frontBucket][this.#frontIdx] = undefined;
            this.#size--;
            return val;
    }
    #en(){
        if(this.#frontBucket < 0 || this.#backBucket > this.#bucketLength){
            let oldLen = this.#bucket.length;
            let newLen = oldLen * 2;
            let newBucket = new Array(newLen);

            let diff = Math.floor((newLen - oldLen) / 2);
            for(let i = 0; i < newLen; ++i){
                if(i >= diff && i < diff + oldLen){
                    newBucket[i] = this.#bucket[i - diff];
                } else{
                    newBucket[i] = new Array(this.#bucketLength);
                }
            }
            this.#frontBucket += diff;
            this.#backBucket += diff;

            this.#bucket = newBucket;

        }
    }
}
