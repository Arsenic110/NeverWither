
var db;
var sendButton;
var loadButton;
var textBox;
var inputBox;
var socket;
var username = "DEBUG";

const collectionName = "messages";

init();

function init() 
{
  sendButton = document.querySelector("#saveButton");
  loadButton = document.querySelector("#loadButton");
  textBox = document.querySelector("#textBox");
  inputBox = document.querySelector("#chat-input-box");

  

  sendButton.addEventListener("click", sendMessage);
  loadButton.addEventListener("click", () => {socket.emit("readAll")});
  inputBox.addEventListener("keyup", function(e){if (e.keyCode === 13) {e.preventDefault(); sendButton.click();}});
  document.querySelector("#nameInput").addEventListener("keyup", function(e){if (e.keyCode === 13) {e.preventDefault(); setName();}});
  //document.querySelector("#nameDialog").style.display = "none";

  inputBox.disabled = true;

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