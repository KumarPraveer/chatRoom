//get all elements
const MessageContainer = document.querySelector(".message-container");

const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const nameOfUser = prompt("Please Enter Your Name!");
const roomId = prompt("Please Enter Room Id!");

messageInput.addEventListener("input", () => {
  socket.emit("typing-effect", messageInput.value);
  //   console.log(messageInput.value);
});

const typingEffectDiv = document.querySelector(".typing-effect");

socket.on("broadcast-typing", (typingData) => {
  const message = `${typingData.username}: ${typingData.textData}`;
  typingEffectDiv.innerText = message;
});
const clientCount = document.getElementById("clientCount");

socket.on("clientCount", (count) => {
  clientCount.innerText = count;
});

if (nameOfUser && roomId) {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerText = `Welcome ${nameOfUser}`;
  MessageContainer.appendChild(notification);
  const UserData = {
    nameOfUser: nameOfUser,
    roomId: roomId,
  };
  socket.emit("welcome-message", UserData);
}

socket.on("broadcast-welcome", (username) => {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerText = `${username} has joined the room`;
  MessageContainer.appendChild(notification);
});

socket.on("broadcast-disconnect", (username) => {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerText = `${username} has left the room`;
  MessageContainer.appendChild(notification);
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = messageInput.value;
  if (messageText) {
    const messageData = {
      message: messageText,
      roomId: roomId,
      username: nameOfUser,
    };
    socket.emit("message", messageData);
    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");

    // const userImage = document.createElement("div");
    // userImage.classList.add("userImage");

    // const img = document.createElement("img");
    // img.src = "https://picsum.photos/200/300";

    const contentSection = document.createElement("div");
    contentSection.classList.add("content-section");

    const username = document.createElement("div");
    username.classList.add("username");
    username.textContent = nameOfUser;

    const message = document.createElement("div");
    message.classList.add("message");
    message.textContent = messageText;

    const time = document.createElement("div");
    time.classList.add("time");
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    time.textContent = hours + ":" + minutes;

    // Append elements
    // userImage.appendChild(img);
    // messageContent.appendChild(userImage);
    contentSection.appendChild(username);
    contentSection.appendChild(message);
    contentSection.appendChild(time);
    messageContent.appendChild(contentSection);

    MessageContainer.appendChild(messageContent);
    MessageContainer.scrollTop = MessageContainer.scrollHeight;
    messageInput.value = "";
    typingEffectDiv.innerText = "";
  }
});

socket.on("broadcast-message", (messageData) => {
  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");

  // const userImage = document.createElement("div");
  // userImage.classList.add("userImage");

  // const img = document.createElement("img");
  // img.src = "https://picsum.photos/200/300";

  const contentSection = document.createElement("div");
  contentSection.classList.add("content-section");

  const username = document.createElement("div");
  username.classList.add("username");
  username.textContent = messageData.username;

  const message = document.createElement("div");
  message.classList.add("message");
  message.textContent = messageData.message;

  const time = document.createElement("div");
  time.classList.add("time");
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  time.textContent = hours + ":" + minutes;

  // Append elements
  // userImage.appendChild(img);
  // messageContent.appendChild(userImage);
  contentSection.appendChild(username);
  contentSection.appendChild(message);
  contentSection.appendChild(time);
  messageContent.appendChild(contentSection);

  MessageContainer.appendChild(messageContent);
  typingEffectDiv.innerText = "";

  MessageContainer.scrollTop = MessageContainer.scrollHeight;
});
