
var db;
var sendButton;
var loadButton;
var textBox;
var inputBox;
var socket;
var username;

const collectionName = "messages";

init();

function init() 
{
  sendButton = document.querySelector("#saveButton");
  loadButton = document.querySelector("#loadButton");
  textBox = document.querySelector("#textBox");
  inputBox = document.querySelector("#chat-input-box");

  var firebaseConfig = 
  {
    apiKey: "AIzaSyAoUxicyEX04HLnW1KLNEYR8ME4eXYyAzE",
    authDomain: "never-wither.firebaseapp.com",
    projectId: "never-wither",
    storageBucket: "never-wither.appspot.com",
    messagingSenderId: "417332238885",
    appId: "1:417332238885:web:5dba3170bec5690a5dbdcc",
    measurementId: "G-XX5LXVK91D"
  };
  firebase.initializeApp(firebaseConfig);

  db = firebase.firestore();

  sendButton.addEventListener("click", sendMessage);
  loadButton.addEventListener("click", loadMessages);
  inputBox.addEventListener("keyup", function(e){if (e.keyCode === 13) {e.preventDefault(); sendButton.click();}});

  db.collection(collectionName).onSnapshot(loadMessages);

  document.querySelector("#nameInput").addEventListener("keyup", function(e){if (e.keyCode === 13) {e.preventDefault(); setName();}});

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

  // db.collection(collectionName).doc(getId()).set(messageObject)
  //   .then((docRef) => {console.log("Document written with ID: ", docRef.id);})
  //   .catch((error) => {console.error("Error adding document: ", error);});

  form.value = "";
}

function loadMessages()
{
  textBox.innerHTML = "";
  db.collection(collectionName).get().then((querySnapshot) => 
  {
    querySnapshot.forEach((doc) => {
      textBox.innerHTML += "<p>" + doc.data().name + " > " + doc.data().contents + "</p>";
    });
    window.scrollTo(0,document.body.scrollHeight);
  });
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