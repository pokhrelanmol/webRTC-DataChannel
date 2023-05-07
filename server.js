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
        console.log(_to);
        io.to(_to).emit("requestAccepted", signal);
        io.to(from).emit("YouAcceptedRequest");
    });
});

server.listen(5000, () => {
    console.log("listening on *:5000");
});
