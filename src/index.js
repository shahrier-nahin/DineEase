const express = require('express');
const path = require('path');
const bcryptjs = require('bcryptjs');
const collection = require("./config");


const app = express();
//convert data into json format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//Use EJS as the view Engine
app.set('view engine', 'ejs');


//static file
app.use(express.static("images"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});


//Register user
app.post("/signup", async (req, res) => {
    const { name, password } = req.body; // Destructure data from request body

    try {
        // Check if the user already exists in the database
        const existingUser = await collection.findOne({ name });

        if (existingUser) {
            return res.send("User already exists. Please choose a different username.");
        }

        // Hash the password before saving
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create a new user document
        const newUser = await collection.create({ name, password: hashedPassword });
        console.log("User created successfully:", newUser);
        res.send("User registration successful!");
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error registering user!");
    }
});



// Login user
app.post("/login", async (req, res) => {
    try {
        // Check if the user exists in the database
        const user = await collection.findOne({ name: req.body.username });

        // If user does not exist, send an error response
        if (!user) {
            return res.send("Username not found");
        }

        // Compare the hashed password from the database with the plain text password
        const isPasswordMatch = await bcryptjs.compare(req.body.password, user.password);

        // If passwords match, render the home page
        if (isPasswordMatch) {
            return res.render("home");
        } else {
            // If passwords don't match, send an error response
            return res.send("Wrong password");
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error:", error);
        return res.send("An error occurred");
    }
});




const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
})