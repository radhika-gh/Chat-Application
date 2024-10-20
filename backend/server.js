//importing express
const express = require("express");
const { chats }= require("./data/data");
const dotenv = require("dotenv");
const connectDB= require("./config/db");
const colors= require("colors");
const userRoutes= require('./routes/userRoutes');
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes= require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
//const { path } = require("framer-motion/client");
const  path  = require("path");

//creating instance of this express

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
//using api

app.use('/api/user',userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message',messageRoutes);




//DEPLOYMENT-start
const __dirname1= path.resolve();
if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname1, '/frontend/build')));
  app.get('*', (req,res)=>{
      res.sendFile(path.resolve(__dirname1,"frontend", "build","index.html" ));
  });
}else{
  app.get("/", (req, res) => {
    res.send("API is running fine");
  });
}
//DEPLOYMENT-end




app.use(notFound);
app.use(errorHandler);

const PORT = process.env.port||5000;
//starting out own server
const server =app.listen(5000,console.log(`server started at ${ PORT} `.yellow.bold));
const io= require('socket.io')(server,{
    pingTimeout :60000,
    cors:{
        origin: "http://localhost:3000",
    }
});
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
socket.on("typing", (room) => socket.in(room).emit("typing"));
socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat || !chat.users) {
      console.error("Chat or chat users are null/undefined");
      return; 
    }
console.log("New message in chat: ", chat._id); // Check chat ID
console.log("Users in this chat: ", chat.users);
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return; // Skip sender

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });


  socket.off("setup", (userData) => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
