import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { createChat, userChats } from "../services/chat";
import { formatDid } from "../utils/index";

const User = ({ data, setChats }) => {
    const { currentUser } = useUser();
    const handleCreateChat = async (id, did) => {
        console.log(currentUser);
        console.log(id, did);
        try {
            await createChat({
                senderId: currentUser._id,
                receiverId: id,
            });
            const { data } = await userChats(currentUser?._id);
            setChats(data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="">
            <span
                className="bg-gray-500 text-white py-1 px-3 rounded-lg cursor-pointer"
                onClick={() => handleCreateChat(data._id, data.did)}
            >
                {formatDid(data?.did)}
            </span>
        </div>
    );
};
export default User;
