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

//I like everything inside functions okay?
function init()
{
    //this doesnt work
    app.use(express.static(__dirname + "/../public"));

    //register the request handler
    app.use(requestListener);
    
    //register io connections
    io.on("connection", registerSockets);

    //server listen on port
    server.listen(port, hostname, () => 
    {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

function requestListener(req, res)
{
    var furl = translateUrl(req.url);

    //serve static files
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

function registerSockets(Socket)
{
    console.log("SocketIO: New Connection: " + Socket.id);

    //register messages from the client
    Socket.on("sendMessage", (data) =>
    {
        //TODO: Implement Database + Client Echo
        console.log(`${data.name} > ${data.contents}`);


    });


}