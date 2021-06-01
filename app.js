const __ENV = process.env.__ENV || 'DEV';
const __SETTING = require('./setting.json')[__ENV];
console.log(__SETTING);

const path = require('path');
const URL = require('url');
const fs = require('fs');

const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const bodyParser = require('body-parser');

const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PATH_WWW = path.join(__dirname, 'www/')

app.use('/', express.static('www'))

app.get("/", (req, res) => { res.sendFile(PATH_WWW + "index.html"); });
app.get("/voice", (req, res) => { res.sendFile(PATH_WWW + "voice.html"); });
app.get("/voice2", (req, res) => { res.sendFile(PATH_WWW + "voice2.html"); });
app.get("/record", (req, res) => { res.sendFile(PATH_WWW + "record/index.html"); });
app.get("/speech2text", (req, res) => { res.sendFile(PATH_WWW + "speech2text.html"); });
app.get("/record-play", (req, res) => { res.sendFile(PATH_WWW + "record-play.html"); });

io.on("connection", socket => {
    socket.on('radio', function (blob) {
        // can choose to broadcast it to whoever you want
        socket.broadcast.emit('voice', blob);
        socket.emit('voice', blob);
    });

    socket.on('data', function (data) {
        socket.broadcast.emit('message', data);
        socket.emit('message', data);
    });

    ////const existingSocket = this.activeSockets.find(
    ////    existingSocket => existingSocket === socket.id
    ////);

    ////if (!existingSocket) {
    ////    this.activeSockets.push(socket.id);

    ////    socket.emit("update-user-list", {
    ////        users: this.activeSockets.filter(
    ////            existingSocket => existingSocket !== socket.id
    ////        )
    ////    });

    ////    socket.broadcast.emit("update-user-list", {
    ////        users: [socket.id]
    ////    });
    ////}

    ////socket.on("call-user", (data) => {
    ////    socket.to(data.to).emit("call-made", {
    ////        offer: data.offer,
    ////        socket: socket.id
    ////    });
    ////});

    ////socket.on("make-answer", data => {
    ////    socket.to(data.to).emit("answer-made", {
    ////        socket: socket.id,
    ////        answer: data.answer
    ////    });
    ////});

    ////socket.on("reject-call", data => {
    ////    socket.to(data.from).emit("call-rejected", {
    ////        socket: socket.id
    ////    });
    ////});

    ////socket.on("disconnect", () => {
    ////    this.activeSockets = this.activeSockets.filter(
    ////        existingSocket => existingSocket !== socket.id
    ////    );
    ////    socket.broadcast.emit("remove-user", {
    ////        socketId: socket.id
    ////    });
    ////});
});

server.listen(__SETTING.HTTP_PORT, () => {
    console.log('PORT = ' + __SETTING.HTTP_PORT);
    console.log('PATH = ' + __dirname);
});
