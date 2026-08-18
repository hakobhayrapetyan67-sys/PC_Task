const EventEmitter = require('events');

class TaskQueue extends EventEmitter {
    constructor(concurrency) {
        super();
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
        this.isIdleEmitted = true;
    }

    add(id, jobFn) {
        this.queue.push({ id, jobFn });
        this.isIdleEmitted = false;
        this.next();
    }

    next() {
        while (this.running < this.concurrency && this.queue.length > 0) {
            const { id, jobFn } = this.queue.shift();
            this.running++;
            this.emit('start', { id });

            jobFn()
                .then((result) => {
                    this.running--;
                    this.emit('complete', { id, result });
                    this.processQueue();
                })
                .catch((error) => {
                    this.running--;
                    this.emit('error', { id, error });
                    this.processQueue();
                });
        }
    }

    processQueue() {
        this.next();
        if (this.running === 0 && this.queue.length === 0 && !this.isIdleEmitted) {
            this.isIdleEmitted = true;
            this.emit('empty');
        }
    }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const queue = new TaskQueue(2);

queue.on('start', ({ id }) => {
    console.log(`start ${id}`);
});

queue.on('complete', ({ id, result }) => {
    console.log(`done ${id} - ${result}`);
});

queue.on('error', ({ id, error }) => {
    console.log(`error ${id} - ${error.message}`);
});

queue.on('empty', () => {
    console.log('finished');
});

queue.add('A', () => delay(300).then(() => 'result-A'));
queue.add('B', () => delay(100).then(() => 'result-B'));
queue.add('D', () => delay(30).then(() => 'result-D'));