import React, { useCallback, useEffect, useState } from "react";
import { getUser } from "../services/user";
import { addMessage, getMessages } from "../services/message";
import { useSocket } from "../contexts/SocketContext";
import { formatDid } from "../utils";
import * as Kilt from "@kiltprotocol/sdk-js";

const useChatBox = (
    chat,
    currentUser,
    peer,
    recievedMessage,
    setRecievedMessage
) => {
    const socket = useSocket();
    const [connection, setConnection] = useState(null);
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [receiverDidDoc, setReceiverDidDoc] = useState({});

    const makeInitialCall = useCallback(() => {
        const senderId = currentUser;
        const receiverId = chat?.members?.find((id) => id !== currentUser);
        socket.emit("send-user-to-call", { senderId, receiverId });
    }, [chat, currentUser, socket]);

    const connectPeer = useCallback(
        (peerId) => {
            console.log("peerid to connect: ", peerId);
            const conn = peer.connect(peerId);
            console.log(conn);
            setConnection(conn);
            conn.on("open", () => {
                console.log("connection open");
            });
        },
        [peer]
    );

    //     useEffect(() => {
    //         (async () => {
    //             const receiverId = chat?.members?.find((id) => id !== currentUser);
    //             const { data } = await getUser(receiverId);
    //             console.log("data: ", data);
    //             const didDoc = await queryFullDid(data.did);
    //             console.log("didDoc: ", didDoc);
    //         })();
    //     }, [chat, currentUser, socket]);

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
            console.log("make initial call");
            makeInitialCall();
        }
        socket.on("make-call", (peerId) => {
            console.log(peerId);
            connectPeer(peerId);
        });
    }, [chat, makeInitialCall, socket]);

    useEffect(() => {
        peer.on("connection", (conn) => {
            conn.on("data", (data) => {
                console.log(data);
                setRecievedMessage(JSON.parse(data));
            });
        });
    }, [peer]);

    useEffect(() => {
        if (recievedMessage !== null && recievedMessage?.chatId === chat?._id) {
            setMessages((prevMessages) => [...prevMessages, recievedMessage]);
        }
    }, [recievedMessage, chat]);

    const handleSend = async (e) => {
        e.preventDefault();
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id,
        };
        console.log(connection);
        connection.send(JSON.stringify(message));

        try {
            const { data } = await addMessage(message);
            setMessages((prevMessages) => [...prevMessages, data]);
            setNewMessage("");
        } catch {
            console.log("error");
        }
    };

    return {
        userData,
        messages,
        newMessage,
        setNewMessage,
        handleSend,
    };
};

export { useChatBox };
