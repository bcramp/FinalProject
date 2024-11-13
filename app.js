const mysql = require('mysql');
const express = require("express");
const app = express();

const http = require('http');
const fs = require('fs');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

// TODO: address this issue
// Create the http server
// const server = http.createServer((req, res) => {
//     // Read the HTML file
//     fs.readFile('index.html', (err, data) => {
//         if (err) {
//             res.writeHead(500, { 'Content-Type': 'text/plain' });
//             res.end('Internal Server Error');
//         } else {
//             res.writeHead(200, { 'Content-Type': 'text/html' });
//             res.end(data);
//         }
//     });
// });

// const port = 3000;
// server.listen(port, () => {
//     console.log(`Server running at http://helloworld:${port}/`);
// });