import React, { useEffect, useRef, useState } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";

const Chat = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const currentUser = useSelector((store) => store.user);
  const usersId = currentUser?._id;
  const user = location.state;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const messageIdsRef = useRef(new Set());
  const typingRef = useRef(null);

  // Fetch user if not in Redux
  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser?._id) return;
      try {
        const res = await axios.get("http://localhost:3000/profile", { withCredentials: true });
        dispatch(addUser(res.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [currentUser, dispatch]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!usersId || !userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:3000/messages/${userId}`, { withCredentials: true });
        setMessages(response.data);
      } catch (error) {
        if (error.response?.status === 401) setTimeout(() => navigate('/login'), 2000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [usersId, userId, navigate]);

  // Socket setup
  useEffect(() => {
    if (!usersId || !userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("joinChat", { usersId, userId });
    });

    socket.on("disconnect", () => setIsConnected(false));
    
    socket.on("receiveMessage", (message) => {
      // Prevent duplicate (only DB ids now)
      if (messageIdsRef.current.has(message._id)) return;
      messageIdsRef.current.add(message._id);
      
      const newMessage = {
        _id: message._id,
        text: message.text,
        sender: message.sender === usersId ? "me" : "other",
        time: new Date(message.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, newMessage]);
    });

    // Typing indicator FIXED
    socket.on("typing", ({ sender, isTyping }) => {
      if (sender === userId) {
        setOtherUserTyping(isTyping);
      }
    });

    return () => socket.disconnect();
  }, [usersId, userId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socketRef.current || !isConnected) return;

    const messageText = input.trim();

    // ❌ Removed optimistic update → no duplicate
    setInput("");

    socketRef.current.emit("sendMessage", { usersId, userId, text: messageText });

    socketRef.current.emit("stopTyping", { usersId, userId });
  };

  const handleTyping = () => {
    if (!socketRef.current || !isConnected) return;

    socketRef.current.emit("typing", { usersId, userId, isTyping: true });

    if (typingRef.current) clearTimeout(typingRef.current);

    typingRef.current = setTimeout(() => {
      socketRef.current.emit("stopTyping", { usersId, userId });
    }, 1000);
  };

  if (isLoading) return (
    <div className="h-[90vh] flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  if (!user) return (
    <div className="h-[90vh] flex flex-col items-center justify-center">
      <div className="alert alert-error">Not Present in your connection List. First try to make connection then you are able to chat</div>
      <button onClick={() => navigate(-1)} className="btn btn-primary mt-4">Go Back</button>
    </div>
  );

  return (
    <div className="flex flex-col h-[90vh] max-w-3xl mx-auto border rounded-xl overflow-hidden bg-base-100">
      
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-circle">
          <ArrowLeft size={20} />
        </button>
        <div className="avatar">
          <div className="w-10 rounded-full">
            <Link to={"/profile/"+userId}>
              <img src={user.photoURL || "/avatar.png"} alt={user.name} />
            </Link>
            
          </div>
        </div>
        <div className="flex-1">
          <h2 className="font-semibold capitalize">{user.name}</h2>
          <p className={`text-xs ${isConnected ? 'text-green-500' : 'text-gray-500'}`}>
            {isConnected ? "Online" : "Connecting..."}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-base-200">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className={`chat ${msg.sender === "me" ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar">
                <div className="w-8 rounded-full">
                  <img src={msg.sender === "me" ? currentUser?.photoURL : user?.photoURL} alt="avatar" />
                </div>
              </div>
              <div className={`chat-bubble ${msg.sender === "me" ? "chat-bubble-primary" : "chat-bubble-neutral"}`}>
                {msg.text}
              </div>
              <div className="chat-footer opacity-50 text-xs mt-1">{msg.time}</div>
            </div>
          ))
        )}

        {otherUserTyping && (
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-neutral">
              <span className="loading loading-dots loading-sm"></span> Typing...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-base-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered flex-1"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={!isConnected}
          />
          <button
            onClick={handleSend}
            className="btn btn-primary btn-square"
            disabled={!isConnected || !input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;