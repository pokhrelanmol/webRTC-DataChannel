import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { logIn } from "../services/Auth";
const RegisterUser = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { setCurrentUser, currentUser } = useUser();
    const registerUser = async () => {
        try {
            const data = await logIn({ email });
            setCurrentUser(data.data.message);
            navigate("/chat");
        } catch (error) {
            alert("Something Went Wrong");
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl">Login</h1>
            <input
                type="email"
                className="border p-2"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
                className="bg-blue-500 border rounded-md px-3 py-1 text-white font-bold"
                onClick={registerUser}
            >
                Login
            </button>
        </div>
    );
};

export default RegisterUser;
