//jshint esversion:6

require('dotenv').config(); // <----- no need any const or variable
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const app = express();

// console.log(process.env.API_KEY);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(mongooseFieldEncryption, {
  fields: ["password"],
  secret: process.env.SECRET
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser =  new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save().then(function(){
    res.render("secrets");
  }).catch(function(error){
    console.log(error);
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}).then(function(foundUser){
    if(foundUser){
      if (foundUser.password = password){
        res.render("secrets");
      };
    };
  }).catch(function(error){
    console.log(error);
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
