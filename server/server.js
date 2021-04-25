const http = require("http");
const fs = require("fs").promises;
const express = require("express");
const socketio = require("socket.io");
const config = require("./config");
const sanitize = require("sanitize-html");

const database = require("./database");

const hostname = config.http.hostname;
const port = config.http.port;
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
    
    //register io connections, callback to the function that handles client -> server and back
    io.on("connection", registerSockets);

    //server listen on port
    server.listen(port, hostname, () => 
    {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

function requestListener(req, res)
{
    //static serving somehow doesnt working. dont look at me, theres at least 3 different ways to start a node server and 
    //every tutorial uses a different one 
    var furl = translateUrl(req.url);

    //serve 'static' files
    fs.readFile(__dirname + "/.." + furl).then((contents) =>
    {
        //ideally you declare header for content type, since our content changes i cbf to implement this
        //res.setHeader('Content-Type', 'text/html');

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

    if(!furl.includes("public"))
        furl = "/index.html";

    return furl;
}

function registerSockets(Socket)
{
    console.log("SocketIO: New Connection: " + Socket.id);

    //register messages from the client
    Socket.on("sendMessage", (data) =>
    {
        //sanitize the inputs!
        var author = sanitize(data.author);
        var contents = sanitize(data.contents);

        //send the message to the database... takes a few miliseconds to read it back, though, so
        database.createMessage(contents, author);

        //we re-emit what we plan to save to the database!
        io.emit("newMessage", `${author} > ${contents}`);
    });

    //read the last 100 messages and send them to the client as an array of pre-made strings 
    //arguably though this logic should be client side to free up the server. maybe.
    Socket.on("readAll", () =>
    {
        database.readMessages((err, m) => 
        {
            if(err) throw err;
            var mArr = [];

            //reverse because the last 100 messages are ordered from latest -> oldest
            m = m.reverse();

            for (var i = 0; i < m.length; i++)
            {
                mArr.push(`${m[i].author} > ${m[i].contents}`);
            }

            //dump it  all
            Socket.emit("readAll", mArr);
        });
    });


}

//for future exports
module.exports = 
{

};