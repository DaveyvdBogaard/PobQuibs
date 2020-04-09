var express = require("express");
var app = express();
var path = require("path");
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Server listening at port %d", port);
});

app.use(express.static(path.join(__dirname, "public")));

var numUsers = 0;

let adminKey = 0;

io.on("connection", (socket) => {
  var addedUser = false;

  socket.on("send_answer", (data) => {
    console.log("New Answer from: " + data.username + " and the answer is: " + data.answer)
    socket.emit("answer_received", {answer: data.answer});
    // TODO Emit to admin only
    socket.broadcast.emit("new_answer", {username: data.username, answer: data.answer})
  });

  socket.on("join", (data) => {
    if (addedUser) return;
    socket.username = data.username;
    ++numUsers;
    addedUser = true;
    console.log('New User ' + data.username)
    // TODO Emit to admin only
    socket.broadcast.emit("new_user", {username: socket.username})
    socket.emit("joined", {
      numUsers: numUsers,
      username: socket.username
    });
  });
  
  socket.on("admin_login", (data) => {
    if(data.password === "1") {
      console.log("admin logged in")
      adminKey = Math.floor(Math.random() * 100);
      socket.emit("login_successful", {key: adminKey});
    } else {
      return;
    }
  });

  socket.on("clear_answers", () => {
    console.log("clearing all answers");
    socket.broadcast.emit("clear_answer");
  });

  socket.on("disconnect", () => {
    if (addedUser) {
      --numUsers;
    }
  });

  socket.on("user_leave", (data) => {
    console.log(data.username + " left")
    addedUser = false;
    socket.broadcast.emit("user_left", {username: data.username})
  })
});
