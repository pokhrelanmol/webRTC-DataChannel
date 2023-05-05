import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { io } from "socket.io-client";
import Peer from "simple-peer";
const socket = io("http://localhost:5000");

function App() {
    const [connectionAccepted, setConnectionAccepted] = useState(false);
    const [connectionEnded, setConnectionEnded] = useState(false);
    const [messages, setMessages] = useState([]); // [{name, message}
    const [name, setName] = useState("");
    const [activeConnection, setActiveConnection] = useState({});
    const [me, setMe] = useState("");
    const [peerId, setPeerId] = useState("");
    const [message, setMessage] = useState("");

    const connectionRef = useRef();

    useEffect(() => {
        socket.on("me", (id) => {
            setMe(id);
            console.log(id);
        });

        socket.on(
            "initializeConnection",
            ({ from, name: callerName, signal }) => {
                setActiveConnection({
                    isReceivingCall: true,
                    from,
                    name: callerName,
                    signal,
                });
            }
        );
    }, []);
    const sendMessage = () => {
        // this is where we need to use DID
        connectionRef.current.send(message);
    };
    const acceptConnection = () => {
        setConnectionAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false });

        peer.on("signal", (data) => {
            alert("connection accepted with data", JSON.stringify(data));
            socket.emit("acceptConnection", {
                signal: data,
                to: activeConnection.from,
            });
        });

        peer.on("data", (data) => {
            var string = new TextDecoder("utf-8").decode(data);
            setMessages([
                ...messages,
                { id: activeConnection.from, message: string },
            ]);
        });

        peer.signal(activeConnection.signal);

        connectionRef.current = peer;
    };

    const initConnection = (id) => {
        const peer = new Peer({ initiator: true, trickle: false });

        peer.on("signal", (data) => {
            alert("pair Initialized with data", JSON.stringify(data));
            socket.emit("initializeConnection", {
                userToCall: id,
                signalData: data,
                from: me,
                name,
            });
        });

        peer.on("data", (data) => {
            var string = new TextDecoder("utf-8").decode(data);

            setMessages([...messages, { id: id, message: string }]);
        });

        socket.on("connectionAccepted", (signal) => {
            setConnectionAccepted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setConnectionEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
    };
    return (
        <>
            <h1>WebRTC Connection </h1>
            <h3>Your Id : {me}</h3>
            <input
                type="text"
                placeholder="Peer ID"
                onChange={(e) => setPeerId(e.target.value)}
            />
            <button onClick={() => initConnection(peerId)}>
                Initialize Peer
            </button>
            <button onClick={acceptConnection}>Accept Connection</button>

            <input
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                placeholder="text"
                name=""
                id=""
            />
            <button onClick={sendMessage}>Send</button>
            {messages.map(({ id, message }) => {
                return (
                    <div style={{}}>
                        <h5>sender: {id}</h5>
                        <p>{message}</p>
                    </div>
                );
            })}
        </>
    );
}

export default App;
