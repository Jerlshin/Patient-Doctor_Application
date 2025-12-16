// //Server for doctor database
// const express = require("express");
// const mongoose = require("mongoose");
// const studentRoute = require("./controller/router");
// const bodyParser = require("body-parser");
// const cors = require("cors");


// mongoose.set("strictQuery", true);
// mongoose.connect("mongodb://127.0.0.1:27017/hackathon");
// var db = mongoose.connection;
// db.on("open", ()=>console.log("Connected to database"));
// db.on("error", ()=>console.log("Error occured while connecting with db"));

// const app = express(); //connecting to app module

// //We are using bodyParser that is a middleware and is used to collect data from a form(client-side) that is stored in 'req.body' to post it on server-side DB. 
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(cors());
// app.use("/doctors", studentRoute);

// app.listen(4000,()=>{
//     console.log("Server Started at 4000")
// });

const express = require("express");
const mongoose = require("mongoose");
const studentRoute = require("./controller/router");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/hackathon");
const db = mongoose.connection;
db.on("open", () => console.log("Connected to database"));
db.on("error", () => console.log("Error occurred while connecting with db"));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/doctors", studentRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    if (socket.id !== data.senderId) {
      socket.to(data.room).emit("receive_message", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
