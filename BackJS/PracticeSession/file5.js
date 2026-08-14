const EventEmitter = require('node:events');

class Downloader extends EventEmitter {
    start(){
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            this.emit('progress', progress);

            if(progress >= 100){
                clearInterval(interval);
                this.emit('done');
            }
        }, 400);
    }
}

const downloader = new Downloader();

downloader.on('progress', (p) => {
    const bars = Math.floor(p / 5);
    const dashes = 20 - bars;
    process.stdout.write(`\r[${'#'.repeat(bars)}${'-'.repeat(dashes)}] ${p}%`);
});
downloader.on('done', () => {
    console.log('\nDownload');
});
downloader.start();