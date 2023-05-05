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
    const [name, setName] = useState("");
    const [activeConnection, setActiveConnection] = useState({});
    const [me, setMe] = useState("");
    const [peerId, setPeerId] = useState("");
    const [message, setMessage] = useState("");

    const myVideo = useRef();
    const userVideo = useRef();
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
            socket.emit("acceptConnection", {
                signal: data,
                to: activeConnection.from,
            });
        });

        peer.on("data", (data) => {
            var string = new TextDecoder("utf-8").decode(data);
            console.log(string);
        });

        peer.signal(activeConnection.signal);

        connectionRef.current = peer;
    };

    const initConnection = (id) => {
        const peer = new Peer({ initiator: true, trickle: false });

        peer.on("signal", (data) => {
            socket.emit("initializeConnection", {
                userToCall: id,
                signalData: data,
                from: me,
                name,
            });
        });

        peer.on("data", (data) => {
            var string = new TextDecoder("utf-8").decode(data);
            console.log(string);
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
            <input
                type="text"
                placeholder="Peer ID"
                onChange={(e) => setPeerId(e.target.value)}
            />
            <button onClick={() => initConnection(peerId)}>
                Initialize Peer
            </button>
            <button onClick={acceptConnection}>Accept Connection</button>

            <div>
                <video ref={myVideo} autoPlay playsInline></video>
                <video ref={userVideo} autoPlay playsInline></video>
            </div>
            <input
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                placeholder="text"
                name=""
                id=""
            />
            <button onClick={sendMessage}>Send</button>
        </>
    );
}

export default App;
