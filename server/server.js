const http = require("http");
const fs = require("fs").promises;

const hostname = "192.168.1.69";
const port = 5999;


const server = http.createServer(requestListener);

init();

function init()
{
    //server listen on port
    server.listen(port, hostname, () => 
    {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

function requestListener(req, res)
{
    var furl = translateUrl(req.url);


    console.log(req.url);
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