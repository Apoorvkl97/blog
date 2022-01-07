//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.nl88l.mongodb.net/blogDB?retryWrites=true&w=majority`,{ useUnifiedTopology: true,useNewUrlParser: true });

const postSchema = {
  title : String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


const homeStartingContent = "Hello! Welcome to Apoorv's blogs. I am a young and enthusiastic Web Developer and I like experimenting with new technologies and new ideas. On this page you can find some articles which I write about my experiences with coding websites and also some random thoughts on topics like astronomy, philosophy, animals, physics etc. \n\nThis is the home page where you can see all the articles from my MongoDB atlas. On clicking '...Read More' it opens a new page with the full blog. I can add my blogs by adding a special path to the URL. Have fun exploring!";
const aboutContent = "I am Apoorv Khandelwal, a full stack MERN developer from India. I can develop websites and web apps using various technologies like NodeJS and ExpressJS for backend, Frameworks like ReactJS and EJS for frontend, DBs like MongoDB and MySQL etc. Moreover, I can use other libraries like Bootstrap, jQuery, Mongoose etc. This blog site is made using ExpressJS, EJS and MongoDB.\n\nI am also good at data analytics using Python and can use libraries like Pandas, seaborn, matplotlib etc.\n\nOther than coding, I am fond of hanging out with friends, watching action and suspense movies, and trying out italian food and coffee at new places!";
const contactContent = "You can reach me at my email- apoorv.kl.97@gmail.com \n\nFind me on instagram and have a look at my personal life at @a.p.o.o.r.v.k \n\nYou can email me and get your own simple blog site for the price of a cup of coffee!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  Post.find({}, function(err, allpost){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: allpost
      });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save();

  res.redirect("/");

});

app.get("/posts/:postID", function(req, res){
  const requestedID = req.params.postID;

  Post.find({}, function(err, allposts){
    allposts.forEach(function(post){
      const storedID = post._id;

      if (storedID == requestedID) {
        res.render("post", {
          title: post.title,
          content: post.content
        });
      };
    });
  });

});

app.get("/delete/:postID", (req,res) => {
  const requestedID = req.params.postID;

  Post.deleteOne({_id:requestedID}, (err) => {
    if(err){
      console.log(err);
    } else {
      res.redirect("/")
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
