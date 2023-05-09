const express = require("express");
const cors = require("cors");
const app = express();
const server = app.listen(5000, () => {
    console.log("listening on *:5000");
});
const io = require("socket.io")(server, {
    cors: true,
});
app.use(express.json());
app.use(cors());
const database = [];
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.post("/login", (req, res) => {
    const { userName, password } = req.body;
    const user = database.find((user) => user.userName === userName);
    if (user) {
        if (user.password === password) {
            res.status(200).json({
                message: "Login Successful",
                user,
            });
        } else {
            res.status(401).json({
                message: "Invalid Credentials",
            });
        }
    } else {
        res.status(404).json({
            message: "User not found",
        });
    }
});

app.post("/registerUser", (req, res) => {
    const { userName, password } = req.body;
    const user = database.find((user) => user.userName === userName);
    if (user) {
        res.status(409).json({
            message: "User already exists",
        });
    } else {
        database.push({
            userName,
            password,
            id: database.length + 1,
        });
        res.status(201).json({
            message: "User created",
        });
    }
    console.log(database);
});

io.on("connection", (socket) => {
    console.log("connected");
    socket.emit("me", socket.id);

    socket.on("sendRequest", ({ _to, signal, from, roomId }) => {
        console.log("sendRequest", from);
        socket.join(roomId); // sender joins the room
        io.to(_to).emit("requestReceived", {
            signal,
            from,
            roomId,
        });
    });

    socket.on("acceptRequest", ({ _to, from, signal, roomId }) => {
        console.log(_to);
        socket.join(roomId); // receiver joins the room
        io.to(_to).emit("requestAccepted", signal);

        io.to(from).emit("YouAcceptedRequest");
    });
});
