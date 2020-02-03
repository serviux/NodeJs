var express = require("express")
var path = require("path")
var hbs = require("hbs")

var express = require("express")
var path = require("path")
var hbs = require("hbs")
var app = express()


app.set("view engine", "hbs")
app.use("/static", express.static(path.join(__dirname , "public")))
hbs.registerPartials(__dirname + "/views/partials")
app.use(express.urlencoded())


hbs.registerHelper("options", function(){
    let options = [3,4,5,10,20]
    let markup = '';
    for(let op of options){
        markup += `<option>${op}</option>`
    }
    return new hbs.handlebars.SafeString(markup)
})

hbs.registerHelper("table", function(num){
    return generate(num)
})

app.get("/index", function(req, res){
    res.render("index")
})


app.post("/results" , function(req, res){
    console.table(req.body)
    res.render("table.hbs", {number: req.body.option})
})

const port = 8080
app.listen(port, ()=>console.log(`Server running on http://localhost:${port}/index`))


function generate(side_length){
    let table = "<table>"
    for(let i = 0; i < side_length; i++){
        let row = "<tr>"
        for(let j =0; j < side_length; j++){
            let color = ((1<<24)*Math.random()|0).toString(16);
            let cell = "<td>"
            let markup = "";
            markup += `<span style = 'color:#FFF; background-color:#${color}'>${color}</span>`;
            markup += '<br/>';
            markup += `<span style = 'color:#000; background-color:#${color}'>${color}</span>`;
            cell += markup;
            cell += "</td>"
            row += cell
            row += "</td>"
        }
        row += "</tr>"
        table += row
    }
    table += "</table>"
    return new hbs.handlebars.SafeString(table);
}