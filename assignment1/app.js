
var http = require("http");
var fs = require("fs")


function get_data_sync(filepath)
{
    let data = fs.readFileSync(filepath);
    return data.toString();
}


http.createServer(function(req, resp)
{
    let url = req.url;
    switch(url)
    {
        case "/todo":
            resp.writeHead(200, {"Content-Type" : "application/json"})
            data = get_data_sync("todo.json")
            resp.end(data);
            break;
        case "/index":
           
            resp.writeHead(200, {"Content-Type" : "text/html"})
            data = get_data_sync("index.html")
            resp.end(data);
            break;
        case "/read-todo":
            resp.writeHead(200, {"Content-Type" : "text/html"})
            data = get_data_sync("read-todo.html");
            resp.end(data);
            break;
        default:
            resp.writeHead(301, {'Location' : "http://" + req.headers['host'] + "/index"})
            resp.end();
            break;


    }
}).listen(8080);

console.log("Server listening on http://localhost:8080/index")