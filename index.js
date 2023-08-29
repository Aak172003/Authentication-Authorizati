// Server Instantiate 
const express = require("express");
const app = express();

//load config from env file
require("dotenv").config();

// Define PORT
const PORT = process.env.PORT || 3000;

//middleware to parse json request body 
// Because after parsing , we easily can extract data from req.body 
app.use(express.json());


// Cookies Parse Middleware
const CookieParser = require('cookie-parser');

// Add Cookies Parser 
app.use(CookieParser());

//import routes for TODO API
const user = require("./routes/user");

// mount the todo API routes
// or append ho jaate /api/v1 wale directory ke bdd 
app.use("/api/v1", user);

//start server
app.listen(PORT, () => {
    console.log(`Server started successfully at http://localhost:${PORT}`);
});

//connect to the database
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
// call 
dbConnect();

//default Route
app.get("/", (req, res) => {
    res.send(`<h1> Hii EveryOne </h1>`);
});






