import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { userChats } from "../services/chat";
import { useNavigate } from "react-router-dom";
import Conversation from "./Conversations";
import ChatBox from "./ChatBox";
import { io } from "socket.io-client";

const Chat = () => {
    const { currentUser } = useUser();
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [recievedMessage, setRecievedMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const navigate = useNavigate();
    const socket = useRef();
    useEffect(() => {
        if (!currentUser) navigate("/");
        const getChats = async () => {
            try {
                const { data } = await userChats(currentUser?._id);
                setChats(data);
            } catch (error) {
                console.log(error);
            }
        };
        getChats();
    }, []);
    useEffect(() => {
        socket.current = io("http://localhost:5000");
        socket.current.emit("new-user-add", currentUser?._id);
        socket.current.on("get-users", (users) => {
            setOnlineUsers(users);
            console.log(users);
        });
    }, [currentUser]);
    //  receive message from socket server
    useEffect(() => {
        socket.current.on("recieve-message", (message) => {
            setRecievedMessage(message);
        });
    }, []);
    // Send message to socket server
    useEffect(() => {
        if (sendMessage !== null) {
            socket.current.emit("send-message", sendMessage);
        }
    }, [sendMessage]);

    return (
        <div className="flex justify-around">
            {/* Left Convesation Panel */}
            <div className="flex flex-col ml-20 gap-5 shadow-lg max-w-fit p-4">
                <h1>CHats</h1>
                <div>
                    {chats?.map((chat) => (
                        <div
                            className="bg-gray-200 p-2 rounded-lg cursor-pointer space-y-3"
                            onClick={() => {
                                setCurrentChat(chat);
                            }}
                        >
                            <Conversation data={chat} />
                        </div>
                    ))}
                </div>
            </div>
            {/* Right Chat Box */}

            <div>
                <ChatBox
                    chat={currentChat}
                    currentUser={currentUser?._id}
                    setSendMessage={setSendMessage}
                    recievedMessage={recievedMessage}
                />
            </div>
        </div>
    );
};

export default Chat;
