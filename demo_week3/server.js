const express = require("express");
const hbs = require("hbs");

const app = express();



app.set("view engine",  "hbs");
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname+ "/public"));
app.use(express.urlencoded({extended:false}));

function rando()
{
    req.num = Math.round(Math.random() * 25)
    next();
}
app.use(rando)

app.get("/", function(req, res){
    res.render("index.hbs", {name: "jeff"});
})

app.listen(8080, ()=>{console.log("server running on http://localhost:8080/")});
