import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Search } from "lucide-react";

const ChatList = () => {
  const [connections, setConnections] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const res = await axios.get("http://localhost:3000/list", {
        withCredentials: true,
      });
      setConnections(res.data.users || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const openChat = (user) => {
    navigate(`/chat/${user._id}`, {
      state: user,
    });
  };

  // 🔍 Filter users
  const filteredUsers = connections.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen ml-15 bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">

      {/* 🔥 Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h1 className="text-xl font-bold">Chats</h1>
        <span className="text-sm text-gray-400">
          {connections.length} connections
        </span>
      </div>

      {/* 🔍 Search Bar */}
      <div className="p-4">
        <div className="flex items-center bg-gray-800 rounded-xl px-3 py-2">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search developers..."
            className="bg-transparent outline-none text-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 📜 Chat List */}
      <div className="px-2">

        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <MessageCircle size={40} />
            <p className="mt-3 text-sm">No chats found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => openChat(user)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition cursor-pointer"
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.photoURL || "https://i.pravatar.cc/100"}
                  className="w-12 h-12 rounded-full object-cover"
                />

                {/* 🟢 Online Dot (optional) */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-medium capitalize">{user.name}</h3>
                <p className="text-sm text-gray-400 truncate">
                  Start chatting with {user.name}
                </p>
              </div>

              {/* Icon */}
              <MessageCircle size={18} className="text-gray-500" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;