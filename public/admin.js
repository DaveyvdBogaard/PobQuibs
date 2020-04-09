function login() {
  let input = document.getElementById("passwordInput").value;
  if (input === "") {
    alert("Choose a password longer than 0 characters");
    return;
  }
  password = input;
  socket.emit("admin_login", { password: input });
}

function clearAnswers() {
  socket.emit("clear_answers");
}

let socket = io();

socket.on("login_successful", (data) => {
  document.getElementById("loginpage").style.display = "none";
  document.getElementById("answerpage").style.display = "block";
});

socket.on("new_answer", (data) => {
  var userbox = document.getElementById(data.username + ".answer")
  userbox.childNodes[0].nodeValue = data.answer
});

socket.on("new_user", (data) => {
  if (document.getElementById(data.username) === null) {
    var node = document.createElement("DIV")
    node.className = "userBox"
    node.id = data.username
    var h3UsernameTitle = document.createElement("H2");
    var h3UsernameTitleText = document.createTextNode(data.username);
    h3UsernameTitle.appendChild(h3UsernameTitleText);
    var h4AnswerTitle = document.createElement("H4");
    var h4AnswerTitleText = document.createTextNode("Answer:");
    h4AnswerTitle.appendChild(h4AnswerTitleText);
    var h3AnswerTitle = document.createElement("H3");
    h3AnswerTitle.id = data.username + ".answer";
    var h3AnswerTitleText = document.createTextNode("data.answer");
    h3AnswerTitle.appendChild(h3AnswerTitleText);
    node.appendChild(h3UsernameTitle)
    node.appendChild(h4AnswerTitle)
    node.appendChild(h3AnswerTitle)
    document.getElementById("answersList").appendChild(node);
  }
});

socket.on("disconnect", () => {
  console.log("you have been disconnected");
});

socket.on("reconnect", () => {
  console.log("you have been reconnected");
});

socket.on("connect", () => {
  console.log("connected");
});

socket.on("reconnect_error", () => {
  console.log("attempt to reconnect has failed");
});
