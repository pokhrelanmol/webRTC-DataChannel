import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { getUser } from "../services/user";
import { createChat } from "../services/chat";

const User = ({ data }) => {
    const { currentUser } = useUser();
    const handleCreateChat = async (id) => {
        await createChat({
            senderId: currentUser._id,
            receiverId: id,
        });
        alert("Chat Created");
    };
    return (
        <div className="">
            <span
                className="bg-gray-500 text-white py-1 px-3 rounded-lg cursor-pointer"
                onClick={() => handleCreateChat(data._id)}
            >
                {data?.email}
            </span>
        </div>
    );
};
export default User;
