
const express = require("express")
const hbs = require("hbs")
require('./db/mongoose/mongoose.js')

let User = require("./db/models/User")

const app = express()
hbs.registerPartials(__dirname + '/views/partials');
app.set("view engine", "hbs")
app.set(express.static(__dirname + "/public"))
app.use(express.urlencoded({extended:false}))

app.get("/", (req, res)=>{
    res.render("index.hbs")
})
app.post("/results", (req, res)=>{
    let user = new User(req.body)
    user.save().then(function(){
        res.render("results.hbs", {name: req.body.name, email: req.body.email})
    }).catch((e)=>{
        res.status(400).send(e)
    })

    
})
const port = 8080
app.listen(port, ()=>{ console.log(`server running on http://localhost:${port}/`)})