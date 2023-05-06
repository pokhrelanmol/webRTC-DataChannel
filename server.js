const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: true,
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("sendRequest", ({ _to, signal, from }) => {
        console.log("sendRequest", from);
        io.to(_to).emit("requestReceived", {
            signal,
            from,
        });
    });

    socket.on("acceptRequest", ({ _to, from, signal }) => {
        io.to(data.to).emit("requestAccepted", signal);
    });
});

server.listen(5000, () => {
    console.log("listening on *:5000");
});
