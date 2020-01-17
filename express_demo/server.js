

// var express = require("express")
// var path = require("path")
// var app = express();
// app.use(express.static(__dirname + "/public"))

// app.get("/test" , function(req, res){
//     res.sendfile(path.join(__dirname,"public/index.html"))
// });

// app.listen(3000, ()=>{console.log("server running on port http://localhost:3000")})



var express = require("express")
var hbs = require("hbs")
var path = require("path")
var app = express();
app.set("view engine", "hbs");


hbs.registerPartials(__dirname + "/views/partials")
app.get("/index", function(req, res){
    res.render("index.hbs", {junk: "My name is jeff"});
})
app.listen(3000, ()=>{console.log("server running on port http://localhost:3000")})