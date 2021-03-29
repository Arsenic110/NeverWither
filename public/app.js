
var db;
var saveButton;
var loadButton;
var textBox;
const collectionName = "messages";

init();
loadMessages();
function init() {

  saveButton = document.querySelector("#saveButton");
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

  saveButton.addEventListener("click", sendMessage);
  loadButton.addEventListener("click", loadMessages);
}

function sendMessage()
{
  console.log('Clicked!');
  let form = document.querySelector("#chat-input-text");
  let message = form.value;

  if(message == "")
    return;

  const messageObject = {
    contents: message
  }

  db.collection(collectionName).add(messageObject)
    .then((docRef) => {console.log("Document written with ID: ", docRef.id);})
    .catch((error) => {console.error("Error adding document: ", error);});

  loadMessages();
  form.value = "";
}

function loadMessages()
{
  var messageArray = new Array();
  console.log("Loading messages");
  textBox.innerHTML = "";
  db.collection(collectionName).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      textBox.innerHTML += "<p>" + doc.data().contents + "</p>";
        console.log(doc.data().contents);
    });
});
  
  
  
}
