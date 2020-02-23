const mongoose = require("mongoose")



let User = mongoose.model("User", {
    name: { type: String, required: true},
    email: { type: String, required: true},
})
module.exports = User

