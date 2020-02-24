const express = require("express")
require("./mongoose/mongoose")
const hbs = require("hbs")
const app = express()

let Employee = require("./models/employee").Employee
hbs.registerPartials(__dirname + "/views/partials")
app.set("view engine", "hbs")
app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({extended:true}))


function emptyEmployee()
{
    let empty = new Employee()
    return empty
}

hbs.registerHelper("formatDate", function(date){
    return date.toDateString()
})


app.get("/", (req, res)=>{
    let employee = emptyEmployee()
    res.render("index.hbs", {emp: employee})
})
app.get("/employees", (req,res)=>{
    res.render("employees.hbs")
})
app.get("/employees/id/:empId", async function(req,res){
    let id = req.params.empId;
    console.log(id)
    
    let result =  await Employee.findById(id)
    emp = result;
  
    if(emp != null) 
    {
        res.render("details.hbs", {emp: emp})
    } else {
        res.statusCode = 404
        res.render("error")
    }
})

app.get("/employees/edit/id/:empId", async function(req,res){
    let id = req.params.empId;
    let result = await Employee.findById(id)
    emp = result;
    if(emp != null)
    {
        action = "Edit/" + id
        res.render("edit.hbs", {emp:emp, action:action})
    }else{
	res.statusCode = 404
	res.render("error")
    }

})

app.get("/employees/delete/id/:empId", async function(req,res){
    let id = req.params.empId;
    let result = await Employee.deleteOne({_id: id})
    if (result.n > 0){
        res.render("delete.hbs")
    } else {
    	res.statusCode = 404
	res.render("error")
    }

})

app.post("/Edit/:empId", async function(req,res){
    let id = req.params.empId
    let updated = new Employee(req.body)
    let resp = await Employee.updateOne({_id: id}, 
        {FirstName: updated.FirstName, LastName: updated.LastName,
        Department: updated.Department, StartDate: updated.StartDate,
        Title: updated.Title, Salary: updated.Salary})
    res.render("employees.hbs")
})

app.post("/add", (req, res)=>{
    console.table(req.body)
    let emp = new Employee(req.body)
    emp.save().then(()=>{
        res.render("employees.hbs")
    })
})

app.get("/employees-json", (req, res) =>{
    res.setHeader("Content-Type", "application/json")
    let findall = Employee.find()
    findall.exec(function(err, doc){
        res.end(JSON.stringify(doc))
    })
})
const port = 8080
app.listen(port, ()=>{console.log(`server running at http://localhost:${port}/`)})
