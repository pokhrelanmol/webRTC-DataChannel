import React, { useCallback, useEffect, useRef, useState } from "react";
import { getUser } from "../services/user";
import { addMessage, getMessages } from "../services/message";
import { useSocket } from "../contexts/SocketContext";
import { formatDid } from "../utils";
const ChatBox = ({
    chat,
    currentUser,
    recievedMessage,
    setRecievedMessage,
    peer,
}) => {
    const [connection, setConnection] = useState(null);
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const socket = useSocket();
    const makeInitialCall = () => {
        const senderId = currentUser;
        const receiverId = chat?.members?.find((id) => id !== currentUser);
        socket.emit("send-user-to-call", { senderId, receiverId });
    };
    const connectPeer = useCallback((peerId) => {
        console.log("peerid to connect: ", peerId);
        const conn = peer.connect(peerId);
        setConnection(conn);
        conn.on("open", () => {
            console.log("connection open");
        }); //this is working
    }, []);
    useEffect(() => {
        const userId = chat?.members?.find((id) => id !== currentUser);
        const getUserData = async () => {
            try {
                const { data } = await getUser(userId);
                setUserData(data);
            } catch (error) {
                console.log(error);
            }
        };

        if (chat !== null) getUserData();
    }, [chat]);

    // fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await getMessages(chat._id);
                setMessages(data);
            } catch (error) {
                console.log(error);
            }
        };

        if (chat !== null) fetchMessages();
    }, [chat?.members, chat?._id]);
    useEffect(() => {
        if (chat !== null) {
            console.log("make intial call");
            makeInitialCall();
        }
        socket.on("make-call", (peerId) => {
            connectPeer(peerId);
        });
    }, [chat]);
    // Listen for connection

    useEffect(() => {
        peer.on("connection", (conn) => {
            conn.on("data", (data) => {
                setRecievedMessage(JSON.parse(data));
            });
        });
    }, []);
    // Receive Message from parent component
    useEffect(() => {
        console.log(chat?._id, recievedMessage?.chatId);
        if (recievedMessage !== null && recievedMessage?.chatId === chat?._id) {
            setMessages([...messages, recievedMessage]);
        }
    }, [recievedMessage]);

    const handleSend = async (e) => {
        e.preventDefault();
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id,
        };

        connection.send(JSON.stringify({ ...message }));

        // send message to database
        try {
            const { data } = await addMessage(message);
            setMessages([...messages, data]);
            setNewMessage("");
        } catch {
            console.log("error");
        }
    };
    return (
        <div>
            {!chat ? (
                <div>Select a chat</div>
            ) : (
                <div>
                    <div>
                        {userData?.did ? formatDid(userData.did) : "Loading..."}
                    </div>
                    <div className="space-y-2">
                        {messages.map((message, id) => (
                            <div
                                key={id}
                                className={`${
                                    message?.senderId === currentUser
                                        ? "flex justify-end"
                                        : "flex justify-start"
                                }`}
                            >
                                <div
                                    className={`${
                                        message?.senderId === currentUser
                                            ? "bg-blue-500"
                                            : "bg-gray-500"
                                    } text-white p-2 rounded-lg`}
                                >
                                    {message?.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <form className="space-y-2 mt-5" onSubmit={handleSend}>
                            <input
                                type="text"
                                className="border p-2 w-full"
                                placeholder="Type a message"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button
                                className="bg-blue-500 text-white float-right p-2 rounded-lg"
                                type="submit"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
