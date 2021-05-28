const express = require('express');
const socketio = require('socket.io');

const socketMain = require('./socketMain');
const mongoose = require('./database');

const port = 2828;

const app = express();
const server = app.listen(port);
const io = socketio(server,{cors: {
    origin: "http://localhost:3000",
    credentials: true
}
  });

io.on('connection', function(socket) {

socketMain(io,socket);

});



