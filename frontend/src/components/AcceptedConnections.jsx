import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
const AcceptedConnections = () => {
  const [connections, setConnections] = useState([]);
  const navigate = useNavigate();

const handleChat = (user) => {
  navigate(`/chat/${user._id}`, {
    state: user, // 🔥 pass full user object
  });
};

  const fetchConnections = async () => {
    try {
      const res = await axios.get("http://localhost:3000/list", {
        withCredentials: true,
      });
      setConnections(res.data.users || []);
    } catch (err) {
      if(err.response?.status==401){
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleOpenProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">My Network</h2>
        <span className="text-sm text-base-content/50">
          {connections.length} connections
        </span>
      </div>

      {/* List */}
      <div className="bg-base-100 rounded-xl border border-base-200 divide-y">
        {connections.length === 0 ? (
          <p className="p-6 text-center text-base-content/50">
            No connections yet
          </p>
        ) : (
          connections.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 hover:bg-base-200 transition cursor-pointer"
              onClick={() => handleOpenProfile(user._id)}
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={
                        user.photoURL ||
                        "https://via.placeholder.com/100"
                      }
                      alt="user"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                <h3 className="font-medium capitalize">
                  {user.name}
                </h3>
              </div>

             {/* Right */}
<div className="flex items-center gap-2">
  
  {/* Chat Button */}
<button
  onClick={(e) => {
    e.stopPropagation();
    handleChat(user); // 🔥 pass full user
  }}
  className="btn btn-sm btn-primary flex items-center gap-1"
>
  <MessageCircle size={16} />
  Chat
</button>

  {/* View Button */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleOpenProfile(user._id);
    }}
    className="btn btn-sm btn-outline btn-primary"
  >
    View
  </button>

</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AcceptedConnections;