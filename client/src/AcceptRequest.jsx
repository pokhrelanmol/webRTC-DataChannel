import React, { useEffect, useRef } from "react";
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

    useEffect(() => {
        socket.on("requestReceived", (data) => {
            setRequestFrom(data.from);
            setActiveConnection({
                from: data.from,
                signal: data.signal,
            });
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

        peer.on("data", (data) => {
            // message from the another party
            const _message = new TextDecoder("utf-8").decode(data);
            setMessages([...messages, _message]);
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
        </div>
    );
};

export default AcceptRequest;
