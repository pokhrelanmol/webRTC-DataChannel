import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import SendRequest from "./SendRequest";
const socket = io("http://localhost:5000");
console.log(socket);
function App() {
    const [connectionAccepted, setConnectionAccepted] = useState(false);
    const [connectionEnded, setConnectionEnded] = useState(false);
    const [messages, setMessages] = useState([]); // [{name, message}
    const [name, setName] = useState("");
    const [activeConnection, setActiveConnection] = useState({});
    const [me, setMe] = useState("");
    const [peerId, setPeerId] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.on("requestReceived", ({ from, signal }) => {
            setActiveConnection({
                isReceivingCall: true,
                from,
                signal,
            });
        });
        socket.on("requestAccepted", () => {
            setConnectionAccepted(true);
        });
    }, []);

    return (
        <>
            <h1>WebRTC Connection </h1>
            <SendRequest />
        </>
    );
}

export default App;
