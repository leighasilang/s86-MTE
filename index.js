const express = require("express");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const userRoutes = require("./userRoutes");
const movieRoutes = require("./movieRoutes");

require("dotenv").config();

const app = express();

const port = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);

// MongoDB connection:
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Now connected to MongoDB Atlas.");
})
.catch((error) => {
    console.error("Connection to the database failed:", error);
});

// Test route
app.get("/", (req, res) => {
    res.send("Movie Catalog API is running!");
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});