require('dotenv').config({ quiet: true });
const http = require('node:http');
const { url } = require('node:inspector');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const url = new URL("https://example.com:8080/users?search=Emil");

    console.log(url.protocol);
    console.log(url.pathname);
    console.log(url.hash);

    res.end();
});



server.listen(PORT, () => {
    console.log('server is runing on port 30001');
});


