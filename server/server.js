const http = require("http");
const fs = require("fs").promises;
const express = require("express");
const socketio = require("socket.io");
const admin = require("firebase-admin");


const hostname = "192.168.1.69";
const port = 5999;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

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

const db = admin.initializeApp(firebaseConfig).firestore();

init();

function init()
{
    app.use(express.static(__dirname + "/../public"));
    app.use(requestListener);

     io.on("connection", function(Socket)
     {
        console.log("SocketIO: New Connection: " + Socket.id);
        Socket.on("sendMessage", function(data)
        {
            //TODO: Implement some shit I dont even know how this works
            console.log("SocketIO: Socket.on(sendMessage)");
        });
    });

    //server listen on port
    server.listen(port, hostname, () => 
    {
        console.log(`Server running at http://${hostname}:${port}/`);
    });


    db.collection("messages").get().then((querySnapshot) => 
     {
      querySnapshot.forEach((doc) => {
        console.log(doc.data().name + " > " + doc.data().contents);
      });
    });

}

function requestListener(req, res)
{
    var furl = translateUrl(req.url);

    //console.log(req.url);
    fs.readFile(__dirname + "/.." + furl).then((contents) =>
    {
        //header for content type
        //res.setHeader('Content-Type', 'text/html'); //be cheese, dont declare header like a chad

        //response code
        res.writeHead(200);
        //the content
        res.end(contents);
    }).catch(err => console.error(err));
}

function Suntier()
{
    return "Gwah!";
}

function translateUrl(furl)
{
    if(furl == "/")
        furl = "/index.html";

    //TODO: Insert file validation logic here

    return furl;
}