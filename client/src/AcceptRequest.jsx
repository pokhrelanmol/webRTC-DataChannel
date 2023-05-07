import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useSocket } from "./SocketContext";
import { useMessage } from "./MessageContext";
import { usePeer } from "./PeerContext";

const AcceptRequest = () => {
    const socket = useSocket();
    const { messages, setMessages } = useMessage();
    const { peer, setPeer } = usePeer();
    const [requestFrom, setRequestFrom] = useState("");
    const [activeConnection, setActiveConnection] = useState();
    const [me, setMe] = useState("");
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        socket.on("requestReceived", (data) => {
            setRequestFrom(data.from);
            setActiveConnection({
                from: data.from,
                signal: data.signal,
            });
        });
        socket.on("me", (id) => {
            setMe(id);
        });
    }, []);
    const acceptRequest = () => {
        const peer = new Peer({ initiator: false, trickle: false });
        peer.on("signal", (data) => {
            socket.emit("acceptRequest", {
                _to: requestFrom,
                from: me,
                signal: data,
            });
        });
        socket.on("YouAcceptedRequest", () => {
            setAccepted(true);
        });
        peer.on("data", (data) => {
            // message from the another party
            const _message = new TextDecoder("utf-8").decode(data);
            console.log(_message);
            // setMessages([...messages, _message]);
        });

        peer.signal(activeConnection.signal);
        setPeer(peer);
    };
    return (
        <div>
            {requestFrom && (
                <div>
                    <p>Request from {requestFrom}</p>
                    <button onClick={acceptRequest}>Accept Request</button>
                </div>
            )}
            {accepted && <div>You Accepted the Request</div>}
        </div>
    );
};

export default AcceptRequest;