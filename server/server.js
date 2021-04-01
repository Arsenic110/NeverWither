const http = require("http");
const fs = require("fs").promises;
const express = require("express");
const socketio = require("socket.io");

const hostname = "192.168.1.69";
const port = 5999;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

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