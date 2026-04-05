const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const connectDB = require('./config/db');
const User = require('./model/User');
const AuthRouter = require('./routing/auth');
const cookieParser = require('cookie-parser');
const profileRouter = require('./routing/profileRoute');
const Connection = require('./routing/connection');
const ChatRouter = require('./routing/Chat');
const app = express();
const cors = require("cors");
const http = require("http");
const initializeSocket = require('./config/socket');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(cookieParser());
app.use(express.json()); 

app.use('/', AuthRouter);
app.use('/', profileRouter);
app.use('/', Connection);
app.use('/', ChatRouter); // Now ChatRouter is defined

const server = http.createServer(app);

initializeSocket(server);

const startServer = async () => {
  try {
    await connectDB(); 
    server.listen(3000, () => {
      console.log("Server is running on port 3000 ");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();