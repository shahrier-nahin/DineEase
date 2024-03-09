const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/DineEase");

//check database connection
connect.then(() => {
    console.log("Database connected Successfully");
})
.catch(() => {
    console.log("Failed to connect Database");
});

//create a schema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

//collection part
const collection = new mongoose.model("users", LoginSchema);

module.exports = collection; 