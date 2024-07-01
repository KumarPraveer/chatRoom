import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";

const port = process.env.PORT;

const app = express();
const httpServer = http.createServer(app);

//middleware

app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let clientCount = 0;
io.on("connection", (socket) => {
  console.log("Connection established");
  clientCount++;
  io.emit("clientCount", clientCount);

  socket.on("welcome-message", (user) => {
    socket.username = user.nameOfUser;
    socket.roomId = user.roomId;
    socket.join(user.roomId);
    socket.to(user.roomId).emit("broadcast-welcome", user.nameOfUser);
  });

  socket.on("typing-effect", (message) => {
    const typingData = {
      username: socket.username,
      textData: message,
    };
    socket.to(socket.roomId).emit("broadcast-typing", typingData);
  });

  socket.on("message", (message) => {
    socket.to(message.roomId).emit("broadcast-message", message);
  });

  socket.on("disconnect", () => {
    socket.to(socket.roomId).emit("broadcast-disconnect", socket.username);
    clientCount--;
    io.emit("clientCount", clientCount);
    console.log("Connection is disconnected");
  });
});

httpServer.listen(port, () => {
  console.log("Server is up at the port ", port);
});
