import React, { cloneElement, useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { userChats } from "../services/chat";
import { useNavigate } from "react-router-dom";
import Conversation from "./Conversations";
import ChatBox from "./ChatBox";
import { useSocket } from "../contexts/SocketContext";
import { usePeer } from "../contexts/PeerContext";
import Peer from "peerjs";
import User from "./User";
import axios from "axios";
import Users from "./Users";

const Chat = () => {
    const { currentUser } = useUser();
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [recievedMessage, setRecievedMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [myPeerId, setMyPeerId] = useState("");
    const navigate = useNavigate();
    const socket = useSocket();
    const _peer = new Peer();

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
    }, [chats]);

    useEffect(() => {
        if (currentUser) {
            _peer.on("open", (id) => {
                setMyPeerId(id);
                socket.emit("new-user-add", {
                    newUserId: currentUser?._id,
                    peerId: id,
                });
                socket.on("get-users", (users) => {
                    setOnlineUsers(users);
                });
            });
        }
    }, []);

    return (
        <div className="flex justify-around">
            {/* Search bar */}

            <Users setChats={setChats} />
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

            <div className="flex-grow">
                <ChatBox
                    peer={_peer}
                    chat={currentChat}
                    currentUser={currentUser?._id}
                    setSendMessage={setSendMessage}
                    recievedMessage={recievedMessage}
                    setRecievedMessage={setRecievedMessage}
                />
            </div>
        </div>
    );
};

export default Chat;
