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
    const { setPeer, peer } = usePeer();
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");

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
        if (!currentUser) navigate("/");
        const getAllUsers = async () => {
            axios.get("http://localhost:8000/api/v1/user").then((res) => {
                setAllUsers(res.data);
            });
        };
        getAllUsers();
    }, []);
    useEffect(() => {
        if (currentUser) {
            _peer.on("open", (id) => {
                console.log("Initial Peer Id: ", id);
                setMyPeerId(id);
                socket.emit("new-user-add", {
                    newUserId: currentUser?._id,
                    peerId: id,
                });
                socket.on("get-users", (users) => {
                    console.log("Online Users: ", users);
                    setOnlineUsers(users);
                });
            });
        }
    }, []);
    const handleSearch = (e) => {
        setSearch(e.target.value);
        const filteredUsers = allUsers.filter((user) =>
            user.email.includes(e.target.value)
        );
        setFilteredUsers(filteredUsers);
    };

    return (
        <div className="flex justify-around">
            {/* Search bar */}

            <div className="flex flex-col ml-20 gap-5 shadow-lg max-w-fit p-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="border-2 border-gray-300 rounded-lg p-2"
                    onChange={(e) => {
                        handleSearch(e);
                    }}
                />
                <div>
                    {filteredUsers.length > 0
                        ? filteredUsers.map((user) => (
                              <div
                                  className="bg-gray-200 p-2 rounded-lg cursor-pointer space-y-3"
                                  onClick={() => {}}
                              >
                                  <User data={user} />
                              </div>
                          ))
                        : allUsers?.map((user) => (
                              <div
                                  className="bg-gray-200 p-2 rounded-lg cursor-pointer space-y-3"
                                  onClick={() => {}}
                              >
                                  <User data={user} />
                              </div>
                          ))}
                </div>
            </div>
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
