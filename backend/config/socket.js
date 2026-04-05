const socket = require("socket.io");
const Message = require('../model/Message');

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected: " + socket.id);

    // Join chat room
    socket.on("joinChat", ({ usersId, userId }) => {
      const roomId = [usersId, userId].sort().join("-");
      socket.join(roomId);
      socket.currentRoom = roomId;
    });

    // Handle sending messages
    socket.on("sendMessage", async ({ usersId, userId, text }) => {
      const roomId = [usersId, userId].sort().join("-");
      
      try {
        const newMessage = new Message({
          sender: usersId,
          receiver: userId,
          text: text,
        });
        
        await newMessage.save();
        
        const messageData = {
          _id: newMessage._id,
          text: text,
          sender: usersId,
          receiver: userId,
          time: new Date(),
        };
        
        // Broadcast to everyone in room (including sender)
        io.to(roomId).emit("receiveMessage", messageData);
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("messageError", { error: "Failed to send message" });
      }
    });

    // Typing indicators
    socket.on("typing", ({ usersId, userId, isTyping }) => {
      const roomId = [usersId, userId].sort().join("-");
      socket.to(roomId).emit("typing", { sender: usersId, isTyping });
    });

    socket.on("stopTyping", ({ usersId, userId }) => {
      const roomId = [usersId, userId].sort().join("-");
      socket.to(roomId).emit("typing", { sender: usersId, isTyping: false });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected: " + socket.id);
      if (socket.currentRoom) {
        socket.leave(socket.currentRoom);
      }
    });
  });

  return io;
};

module.exports = initializeSocket;