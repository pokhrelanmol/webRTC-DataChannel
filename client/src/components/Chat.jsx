import React, { cloneElement, useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { userChats } from "../services/chat";
import { useNavigate } from "react-router-dom";
import Conversation from "./Conversations";
import ChatBox from "./ChatBox";
import { useSocket } from "../contexts/SocketContext";
import Peer from "peerjs";
import Users from "./Users";

const Chat = () => {
    const { currentUser } = useUser();
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [recievedMessage, setRecievedMessage] = useState(null);
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
                // socket.on("get-users", (users) => {
                //     setOnlineUsers(users);
                // });
            });
        }
    }, []);

    return (
        <div className="flex gap-10 justify-around">
            {/* Search bar */}

            {/* <Users setChats={setChats} /> */}
            {/* Left Convesation Panel */}

            <div className="flex ml-10 flex-col gap-5 min-w-[300px] shadow-lg max-w-fit p-4">
                <h1 className="text-center text-gray-400 font-bold text-lg">
                    CHats
                </h1>
                <div>
                    {chats?.map((chat, index) => (
                        <div
                            key={index}
                            className="space-y-6 min-w-full overflow-y-scroll h-[500px]"
                            onClick={() => {
                                setCurrentChat(chat);
                            }}
                        >
                            <Conversation data={chat} />

                            <Conversation data={chat} />
                            <Conversation data={chat} />
                            <Conversation data={chat} />
                            <Conversation data={chat} />
                            <Conversation data={chat} />
                            <Conversation data={chat} />
                            <Conversation data={chat} />
                            <Conversation data={chat} />
                            <Conversation data={chat} />
                        </div>
                    ))}
                </div>
            </div>
            {/* Right Chat Box */}
            {/* {currentChat && ( */}
            <div className="flex-1">
                <ChatBox
                    peer={_peer}
                    chat={currentChat}
                    currentUser={currentUser?._id}
                    setSendMessage={setSendMessage}
                    recievedMessage={recievedMessage}
                    setRecievedMessage={setRecievedMessage}
                />
            </div>
            {/* )} */}
        </div>
    );
};

export default Chat;
