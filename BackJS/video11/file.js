const net = require('node:net');

const server = net.createServer((socket) => {

    socket.on("data", (data) => {
        console.log(socket.remotePort);

        const responseBody = '<h1> Hello</h1>';

        const response = 
        'HTTP/1.1 200 OK\r\n' + 
        'Content-type: inner/text\r\n'+
        'Content-length: ' +
        Buffer.byteLength(responseBody) + 
        '\r\n' +
        'Connection: close \r\n' + 
        '\r\n' +
        responseBody;
    });
    socket.write(response);
    socket.end();
});


server.listen(3001, '127.0.0.1', () => {
    console.log('server is runing');
});
