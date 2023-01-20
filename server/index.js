import express from "express";
import routes from "./Routes/routes.js";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./Database/connectDB.js";
import multer from "multer";
import usersModal from "./Modules/User.js";
import CreateRoom from "./ChatOperations/createRoom.js";
import pushMsg from "./ChatOperations/pushMsg.js";  
import findRoom from "./ChatOperations/findRoom.js";
import path from "path";
import fs from "fs";


const app = express();
// import { writeFile } from "fs";
const __dirname = path.resolve();
const PORT = process.env.PORT || 8080;
const url = `mongodb+srv://bilal:151214bscs@cluster0.ouusdwa.mongodb.net/?retryWrites=true&w=majority`;
connectDB(url);
app.use(cors("*"));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static("./build"));
//muilter start here.............
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + Math.random() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use("/", routes);

app.use("/upload", express.static("./upload"));
// .......start route update of profile pic.........
app.post("/userprofile", upload.single("file"), async (req, res) => {
  try {
    let data;
    const _id = req.body.id;
    const previous = await usersModal.findOne({ _id });
    if (req.file) {
      data = await usersModal.findByIdAndUpdate(_id, {
        name: req.body.name,
        email: req.body.email,
        img: req.file.filename,
      });
    } else {
      data = await usersModal.findByIdAndUpdate(_id, {
        name: req.body.name,
        email: req.body.email,
      });
    }
    // console.log("user profile data:", data);
    if (previous.img !== "" && req.file && req.file.path) {
      if (data.img !== req.file.path) {
        console.log("not equal");
        try {
          fs.unlink("upload/" + data.img, (err) => {
            console.log(err);
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    if (data) {
      res.status(202).json({
        status: "ok",
        success: true,
        message: "Update successfully",
      });
    } else {
      res.json({
        status: "error",
        success: false,
        message: "Not successfully update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      success: false,
      message: "Server error or routesis not match !",
    });
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ status: false, data: error });
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "./build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const server = app.listen(PORT, (req, res) => {
  console.log("Server run successfully");
});

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://nft-aly.herokuapp.com"
        : "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});



let users=[];

// const getUser = (userId) => {
//   return users.find(user => user.sub === userId);
// }

io.on("connection", (socket) => {
  socket.on("create-room", async ({ user1, user2 }) => {
    const room = await CreateRoom(user1, user2);
    socket.emit("recieve-room", { room });
    socket.join(`${room._id}`);
  });

  socket.on("findRooms", async ({ account }) => {
 
    const rooms = await findRoom(account);
    
    socket.emit("allRoomsUsers", { rooms });
  })

  // socket.on('login', function(userId){
  //   console.log('a user ' + userId + ' connected');
  //   users[socket.id] = userId;

  //   socket.emit("getdata", {users:users[socket.id]})
  // });

  // socket.on('disconnect', function(){
  //   console.log('user ' + users[socket.id] + ' disconnected');
  //   // remove saved socket from users object
  //   delete users[socket.id];
  // });




  socket.on("message", async ({ name, message, otherUser, type }) => {

   
   
    const room = await CreateRoom(name, otherUser);
    pushMsg(message, room, name, type);
    socket
      .to(`${room._id}`)
      .emit("recieve-message", { name, message, otherUser, type });
  });

 
    //  USER IS ONLINE
  //    socket.on("typing", (userId) => {
  //     console.log(userId, "typing..."); // update online status
  // });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });


  socket.on('login', ({_id,timestamp}) => {
    console.log(_id, timestamp)
    usersModal.findOneAndUpdate({ _id:_id }, { status: 'online' ,lastseen:timestamp} , (err, user) => {
      // console.log(user)
      if (err) {
        console.log(err);
      } else {
        socket.emit('user_status', { _id, status: user.status, name:user.name});
      }
    });
  });

  socket.on('logout', ({_id,timestamp}) => {
    console.log(_id, timestamp)
    usersModal.findOneAndUpdate({ _id:_id }, { status: 'offline',lastseen:timestamp }, (err, user) => {
      console.log(user)
      if (err) {
        console.log(err);
      } else {
        socket.emit('user_status', { _id, status: 'offline' });
      }
    });
  });

  socket.on("user_status",(_id)=>{
    usersModal.findOne({_id:_id},(err,user)=>{
      console.log(user)
      socket.emit("user-data",user)
      return user
    })
  } )
    
  // USER IS OFFLINE
  socket.on("offline", (userId) => {
      console.log(userId, "Is Offline!"); // update offline status
  });

  // socket.on("disconnect", (reason ) => {
  // console.log(`remove from socket becuase of some ${reason}`)    
  // });
});
