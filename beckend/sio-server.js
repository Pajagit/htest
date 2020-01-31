var express = require("express");
var app = express();
var server = app.listen(4000);
var io = require("socket.io").listen(server);
var webSocket = require("./config/keys").webSocket;

io.on("connection", function(socket) {
  socket.on("refreshUserToken", function(data) {
    socket.broadcast.emit("refreshUserToken", data);
  });
});

console.log(`Starting Socket App - ${webSocket}`);
