import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useMessage } from "./MessageContext";
import { usePeer } from "./contexts/PeerContext";
import { useSocket } from "./contexts/SocketContext";

const SendRequest = () => {
    const socket = useSocket();
    const { messages, setMessages } = useMessage();
    const [idToSendRequest, setIdToSendRequest] = useState(""); // later gonna use email or DID
    const [myId, setMyId] = useState("");
    const [accepted, setAccepted] = useState(false); // if the request is accepted or not
    const { peer, setPeer } = usePeer();
    useEffect(() => {
        socket.on("me", (id) => {
            setMyId(id);
            console.log(id);
        });
    }, []);
    const sendRequest = () => {};
    const handleSendRequest = () => {
        const peer = new Peer({ initiator: true, trickle: false }); // init peer object
        //   get data from peer
        peer.on("signal", (data) => {
            socket.emit("sendRequest", {
                _to: idToSendRequest, // we will use socketId for now
                from: myId, // we will use socketId for now
                signal: data,
            });
        });

        socket.on("requestAccepted", (signal) => {
            peer.signal(signal); //server will send signal from the user who accepted the request
            setAccepted(true);
        });

        peer.on("data", (data) => {
            // receive message from peer
            const _message = new TextDecoder("utf-8").decode(data);
            // setMessages([...messages, _message]);
            console.log(_message);
        });

        setPeer(peer);
    };

    return (
        <div>
            <div>Your Id {myId}</div>
            <input
                type="text"
                placeholder="Socket Id to send request to"
                onChange={(e) => setIdToSendRequest(e.target.value)}
                value={idToSendRequest}
            />
            <br />
            <button onClick={handleSendRequest}>Send Request</button>
            {accepted && (
                <>
                    <p>Request Accepted</p>
                    <p>You are now friend</p>
                </>
            )}
        </div>
    );
};

export default SendRequest;
