
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
  loadButton.addEventListener("click", loadMessages);
  inputBox.addEventListener("keyup", function(e){if (e.keyCode === 13) {e.preventDefault(); sendButton.click();}});

  //db.collection(collectionName).onSnapshot(loadMessages);
  document.querySelector("#nameDialog").style.display = "none";
  //username = "DEBUG";
  //document.querySelector("#nameInput").addEventListener("keyup", function(e){if (e.keyCode === 13) {e.preventDefault(); setName();}});


  socket = io.connect("http://192.168.1.69:5999");
}

function sendMessage()
{
  let form = document.querySelector("#chat-input-box");
  let message = form.value;

  if(message == "")
    return;

  const messageObject = {
    name: username,
    contents: sanitizeString(message)
  }

  socket.emit("sendMessage", messageObject);

  form.value = "";
}

function loadMessages()
{
  // textBox.innerHTML = "";
  // db.collection(collectionName).get().then((querySnapshot) => 
  // {
  //   querySnapshot.forEach((doc) => {
  //     textBox.innerHTML += "<p>" + doc.data().name + " > " + doc.data().contents + "</p>";
  //   });
  //   window.scrollTo(0,document.body.scrollHeight);
  // });
  socket.emit("loadMessages");
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
  }
}