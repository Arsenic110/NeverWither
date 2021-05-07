
var db;
var sendButton;
var loadButton;
var textBox;
var inputBox;
var socket;
var username = "DEBUG";

const collectionName = "messages";

window.onload = init;

function init() 
{

  

  //why use jq am i right
  sendButton = document.querySelector("#saveButton");
  loadButton = document.querySelector("#loadButton");
  textBox = document.querySelector("#textBox");
  inputBox = document.querySelector("#chat-input-box");

  //testing this thing I found on github
  $('#chat-input-box').pastableTextarea();

  //init all the event listeners
  sendButton.addEventListener("click", sendMessage);
  loadButton.addEventListener("click", () => {socket.emit("readAll")});
  inputBox.addEventListener("keyup", function(e){if (e.keyCode === 13) {e.preventDefault(); sendButton.click();}});
  document.querySelector("#nameInput").addEventListener("keyup", function(e){if (e.keyCode === 13) {e.preventDefault(); setName();}});
  $('#chat-input-box').on("pasteImage", (ev, data) => {sendImage(ev, data);});

  //to stop cheaters from writing before setting a name :)
  inputBox.disabled = true;

  //some socket.io garbage set up i dont know i wrote this a few weeks ago i dont remember
  socket = io.connect(window.location.href);
  socket.emit("readAll");

  socket.on("newMessage", loadMessage);
  socket.on("readAll", loadMessages);

}

function sendMessage()
{
  let message = inputBox.value;

  if(message == "")
    return;

  const messageObject = {
    author: username,
    contents: message
  }

  socket.emit("sendMessage", messageObject);

  inputBox.value = "";
}

function sendImage(ev, data)
{
  console.log("wow sent image, here test: " + URL.createObjectURL(data.blob));
  //console.log(data);

  var imageObject = {author: username, data: data.blob};
  socket.emit("sendImage", imageObject);
}

function sendMessageTest(msg)
{
  socket.emit("sendMessage", { author:username, contents: msg});
}

function loadMessage(doc)
{
  //textBox.innerHTML = "";
 
  textBox.innerHTML += "<p>" + doc + "</p>";
  window.scrollTo(0, document.body.scrollHeight);

  //socket.emit("loadMessages");
}

function loadMessages(docarr)
{
  textBox.innerHTML = "";

  //console.log("reading all from: " + typeof(docarr));
  for(var i = 0; i < docarr.length; i++)
  {
    textBox.innerHTML += "<p>" + docarr[i] + "</p>";
  }
    
  window.scrollTo(0, document.body.scrollHeight);

  //socket.emit("loadMessages");
}

function loadMessagesBefore()
{
  socket.emit("loadMessagesBefore");
}

function getId()
{
  var snowflake = 0;

  snowflake = new Date().getTime();

  return snowflake.toString();
}

function sanitizeString(str)
{
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
  return str.trim();
}

function setName()
{
  var locname = document.querySelector("#nameInput").value;
  if(locname == "")
    return;
  else
  {
    username = sanitizeString(locname);
    document.querySelector("#nameDialog").style.display = "none";
    inputBox.disabled = false;
  }
  
}