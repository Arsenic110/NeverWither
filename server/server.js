const http = require("http");
const fs = require("fs").promises;
const express = require("express");
const socketio = require("socket.io");
const mongodb = require("mongodb");
const config = require("./config");

//const mongoClient = mongodb.MongoClient;
//const mongodbUrl = config.database.hostname;
//const mongoose = require("mongoose");

const database = require("./database");

const hostname = config.http.hostname;
const port = config.http.port;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Make sure to add the class name to simplify syntax.
//const Subsystem = require("./subsystem").Subsystem;

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
        console.log(`Client sent: ${data.author} > ${data.contents}`);

        database.createMessage(data.contents, data.author);

        io.emit("newMessage", `${data.author} > ${data.contents}`);
    });

    Socket.on("readAll", () =>
    {
        database.readMessages((err, m) => 
        {
            if(err) throw err;
            var mArr = [];
            //console.log(m.length + " " + typeof(m));

            m = m.reverse();

            for (var i = 0; i < m.length; i++)
            {
                //console.log("Inside the loop but no worky: " + i);
                //console.log(`Pushing ${m[i].author} > ${m[i].contents}`);
                mArr.push(`${m[i].author} > ${m[i].contents}`);
            }

            Socket.emit("readAll", mArr);
        });
    });


}

//for future exports
module.exports = 
{

};