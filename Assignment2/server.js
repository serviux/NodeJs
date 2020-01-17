var express = require("express")
var path = require("path")
var hbs = require("hbs")
var app = express()
app.set("view engine", "hbs")
app.use("/static", express.static(path.join(__dirname , "public")))
hbs.registerPartials(__dirname + "/views/partials")
app.use(express.urlencoded())

app.get("/index", function(req, res){
    res.render("index.hbs")
})

app.get("/about", function(req, res){
    res.render("about.hbs")
})

app.get("/form", function(req, res){
    res.render("form.hbs")
})

app.post("/results" , function(req, res){
    console.table(req.body)
    res.render("results.hbs", {name: req.body.Name, email: req.body.Email, comments: req.body.Comments})
})

app.listen(8080, ()=>console.log("Server running on http://localhost:8080/index"))