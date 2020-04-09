let usernameInput = document.querySelector('.usernameInput'); // Input for username
let messages = document.querySelector(".messages"); // Messages area
let inputMessage = document.querySelector(".inputMessage"); // Input message input box
let loginButton = document.querySelector(".loginButton");
let loginPage = document.getElementsByClassName("login page"); // The console.login page
let answerPage = document.getElementsByClassName("answer page"); // The answerroom page

let username3;
let answer;
let connected = false;
let typing = false;
let lastTypingTime;
let currentInput = usernameInput.focus();

function login() {
  let input = document.getElementById("usernameInput").value
  if (input === "") {
    alert("Choose a name longer than 0 characters")
    return;
  }
  username3 = input;
  socket.emit("join", {username: input})
}

function sendAnswer() {
  let input = document.getElementById("answerInput").value
  if (input === "") {
    alert("Choose a answer longer than 0 characters")
    return;
  }
  answer = input;
  socket.emit("send_answer", {answer: input, username: username})
}

function exit() {
  localStorage.clear()
  socket.emit('user_leave', {username: username})
  document.getElementById("loginpage").style.display = "block";
  document.getElementById("answerpage").style.display = "none";
}

let socket = io();

socket.on("answer_received", (data) => {
  document.getElementById("answerButton").disabled = true;
  var node = document.createElement("LI");
  var textnode = document.createTextNode(data.answer);
  node.appendChild(textnode);
  document.getElementById("answerList").appendChild(node);
})

socket.on("joined", (data) => {
  username = data.username;
  document.getElementById("loginpage").style.display = "none";
  document.getElementById("answerpage").style.display = "block";
  localStorage.setItem("username", data.username)
})

socket.on("clear_answer", () => {
  document.getElementById("answerButton").disabled = false;
  document.getElementById("answerInput").value = "";
})

socket.on("disconnect", () => {
  console.log("you have been disconnected");
});

socket.on("reconnect", () => {
  console.log("you have been reconnected");
  if (localStorage.getItem("username") !== null) {
    socket.emit("join", {username: localStorage.getItem("username")});
  }
});

socket.on("connect", () => {
  console.log("connected")
  if (localStorage.getItem("username") !== null) {
    socket.emit("join", {username: localStorage.getItem("username")});
  }
})

socket.on("reconnect_error", () => {
  console.log("attempt to reconnect has failed");
});
