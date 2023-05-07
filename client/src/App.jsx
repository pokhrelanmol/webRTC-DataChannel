import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Peer from "simple-peer";
import SendRequest from "./SendRequest";
import { useSocket } from "./SocketContext";
import AcceptRequest from "./AcceptRequest";
import SendMessage from "./SendMessage";
function App() {
    const [connectionAccepted, setConnectionAccepted] = useState(false);
    const [connectionEnded, setConnectionEnded] = useState(false);
    const [messages, setMessages] = useState([]); // [{name, message}
    const [name, setName] = useState("");
    const [activeConnection, setActiveConnection] = useState({});
    const [me, setMe] = useState("");
    const [peerId, setPeerId] = useState("");
    const [message, setMessage] = useState("");
    const socket = useSocket();

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
            <h1>Send Request</h1>
            <SendRequest />
            <h1>Accept Request</h1>
            <AcceptRequest />
            <h1>Send Message</h1>
            <SendMessage />
        </>
    );
}

export default App;
