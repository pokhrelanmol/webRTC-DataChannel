import { useEffect, useRef, useState } from "react";
import { useSocket } from "./contexts/SocketContext";
import { Routes, Route } from "react-router-dom";
import Chat from "./components/Chat";
import Auth from "./components/Auth";
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
                <Route path="/" element={<Auth />} />
            </Routes>
            <Routes>
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </>
    );
}

export default App;
