import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import SendRequest from "./SendRequest";
import { useSocket } from "./contexts/SocketContext";
import AcceptRequest from "./AcceptRequest";
import SendMessage from "./SendMessage";
import RegisterUser from "./RegisterUser";
import { Routes, Route } from "react-router-dom";
import Chat from "./components/Chat";
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

    return (
        <>
            <h1 className="text-red-800 text-2xl text-center ">Chat App</h1>
            <Routes>
                <Route path="/" element={<RegisterUser />} />
            </Routes>
            <Routes>
                <Route path="/chat" element={<Chat />} />
            </Routes>
            {/* <h1>Send Request</h1>
            <SendRequest />
            <h1>Accept Request</h1>
            <AcceptRequest />
            <h1>Send Message</h1>
            <SendMessage /> */}
        </>
    );
}

export default App;
