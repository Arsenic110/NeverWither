
var db;
var sendButton;
var loadButton;
var textBox;
const collectionName = "messages";

init();
function init() {

  sendButton = document.querySelector("#saveButton");
  loadButton = document.querySelector("#loadButton");
  textBox = document.querySelector("#textBox");

  var firebaseConfig = {
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

  db.collection(collectionName).onSnapshot(loadMessages);
}

function sendMessage()
{
  console.log('Clicked!');
  let form = document.querySelector("#chat-input-text");
  let message = form.value;

  if(message == "")
    return;

  const messageObject = {
    contents: sanitizeString(message)
  }

  db.collection(collectionName).doc(getId()).set(messageObject)
    .then((docRef) => {console.log("Document written with ID: ", docRef.id);})
    .catch((error) => {console.error("Error adding document: ", error);});

  form.value = "";
}

function loadMessages()
{
  console.log("Loading messages");
  textBox.innerHTML = "";
  db.collection(collectionName).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      textBox.innerHTML += "<p>" + doc.data().contents + "</p>";
        console.log(doc.data().contents);
    });
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