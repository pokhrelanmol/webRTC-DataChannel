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

    socket.on("disconnect", () => {
        socket.broadcast.emit("connectionEnded");
    });

    socket.on(
        "initializeConnection",
        ({ userToCall, signalData, from, name }) => {
            io.to(userToCall).emit("initializeConnection", {
                signal: signalData,
                from,
                name,
            });
        }
    );

    socket.on("acceptConnection", (data) => {
        io.to(data.to).emit("connectionAccepted", data.signal);
    });
});

server.listen(5000, () => {
    console.log("listening on *:5000");
});
