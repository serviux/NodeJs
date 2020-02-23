const mongoose = require("mongoose")
let Schema = mongoose.Schema;
const EmployeeSchema = Schema({
	FirstName: {type: String, lowercase: true},
	LastName: {type: String, lowercase: true},
	Department: {type: String, lowercase: true},
	StartDate: {type: Date},
	Title: {type: String, lowercase: true},
	Salary: {type: Number}
})

let Employee = mongoose.model("Employee", EmployeeSchema)

module.exports = {Employee};
