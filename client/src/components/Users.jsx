import React, { useState, useEffect } from "react";
import User from "./User";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
const Users = ({ setChats }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");
    const { currentUser } = useUser();

    useEffect(() => {
        const getAllUsers = async () => {
            axios.get("http://localhost:8000/api/v1/user").then((res) => {
                const filterCurrrUser = res.data.filter(
                    (user) => user._id !== currentUser?._id
                );
                setAllUsers(filterCurrrUser);
            });
        };
        getAllUsers();
    }, []);
    const handleSearch = (e) => {
        setSearch(e.target.value);
        const filteredUsers = allUsers.filter((user) =>
            user.did.includes(e.target.value)
        );
        setFilteredUsers(filteredUsers);
    };
    return (
        <div>
            <div className="flex flex-col gap-2 shadow-lg max-w-fit">
                <input
                    type="text"
                    placeholder="Search"
                    className="border-2 border-gray-300 rounded-lg p-2"
                    value={search}
                    onChange={(e) => {
                        handleSearch(e);
                    }}
                />
                <div>
                    {filteredUsers.length > 0
                        ? filteredUsers.map((user, index) => (
                              <div
                                  key={index}
                                  className="bg-gray-200 p-2 rounded-lg cursor-pointer space-y-3"
                                  onClick={() => {}}
                              >
                                  <User setChats={setChats} data={user} />
                              </div>
                          ))
                        : allUsers?.map((user, index) => (
                              <div
                                  key={index}
                                  className="bg-gray-200 p-2 rounded-lg cursor-pointer space-y-3"
                                  onClick={() => {}}
                              >
                                  <User setChats={setChats} data={user} />
                              </div>
                          ))}
                </div>
            </div>
        </div>
    );
};

export default Users;
