const net = require('node:net');
const fs = require('node:fs');


const envFile = fs.readFileSync('./.env', 'utf8');
const portLine = envFile.split('\n').find(line => line.startsWith('PORT='));
const PORT = portLine ? Number(portLine.split('=')[1].trim().replace('\r', '')) : 3001;


const socket = net.createConnection({port: PORT, host: '127.0.0.1'}, () => {
    console.log(`Connected to server on port ${PORT}`);
});

socket.on("data", (data) => {
    console.log(data.toString().trim());
});

socket.on("close", () => {
    console.log('Server disconnected');
});

socket.on('error', (err) => {
    console.log(err.message);
});

process.stdin.on("data", (data) => {
    socket.write(data);
})
