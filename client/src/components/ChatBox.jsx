import React, { useEffect, useState } from "react";
import { getUser } from "../services/user";
import { addMessage, getMessages } from "../services/message";

const ChatBox = ({ chat, currentUser, setSendMessage, recievedMessage }) => {
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

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
    }, [chat, currentUser]);

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
    }, [chat]);
    // Send Message
    const handleSend = async (e) => {
        e.preventDefault();
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id,
        };
        const receiverId = chat.members.find((id) => id !== currentUser);
        // send message to socket server
        setSendMessage({ ...message, receiverId });
        // send message to database
        try {
            const { data } = await addMessage(message);
            setMessages([...messages, data]);
            setNewMessage("");
        } catch {
            console.log("error");
        }
    };
    // Receive Message from parent component
    useEffect(() => {
        console.log("Message Arrived: ", recievedMessage);
        if (recievedMessage !== null && recievedMessage?.chatId === chat?._id) {
            setMessages([...messages, recievedMessage]);
        }
    }, [recievedMessage]);
    console.log(chat);
    return (
        <div>
            {!chat ? (
                <div>Select a chat</div>
            ) : (
                <div>
                    <div>{userData?.email ? userData.email : "Loading..."}</div>
                    <div>
                        {messages.map((message) => (
                            <div
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
