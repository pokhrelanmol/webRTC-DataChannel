import React, { useState } from "react";
import { usePeer } from "./PeerContext";

const SendMessage = () => {
    const { peer, setPeer } = usePeer();
    const [message, setMessage] = useState("");
    const handleSendMessage = () => {
        peer.send(message);
    };
    return (
        <div>
            <input
                type="text"
                placeholder="message"
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send Message</button>
        </div>
    );
};

export default SendMessage;
