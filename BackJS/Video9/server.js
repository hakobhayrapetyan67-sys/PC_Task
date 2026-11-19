const net = require('node:net');
const fs = require('node:fs');

const envFile = fs.readFileSync('./.env').toString();
const PORT = envFile.split('=')[1];

const clients = [];

const brodcast = (message, currentClient) => {
    for(const client of clients){
        if(client !== currentClient){
            client.write(message);
        }
    }
}

const server = net.createServer((socket) => {
    console.log('New client connected');
    
    clients.push(socket);

    socket.on("data",(data) => {
        const message = `> ${data.toString().trim()}`;
        brodcast(message, socket);
    });

    socket.on("close", () => {
        console.log("Client disconnectes");
    });

    //socket.end(() => {});

});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is runing on port: ${PORT}`); 
});











