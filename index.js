const path = require('path');
const expressEdge = require('express-edge');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./database/models/Post');

 
const app = new express();
 
mongoose.connect('mongodb://localhost:27017/node-blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

app.use(express.static(__dirname + '/public'));
app.use(expressEdge);
app.set("views", __dirname + "/views");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.sendFile(path.resolve(__dirname, "pages/about.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.resolve(__dirname, "pages/contact.html"));
});

app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('post', {
        post
    })
});

app.get('/posts/new', (req, res) => {
    res.render('create')
});

// Blog page
app.get('/news', async (req, res) => {
    const posts = await Post.find({})
    res.render('news', {
        posts
    })
});

app.post('/posts/store', (req, res) => {
    console.log(req.body)
    Post.create(req.body, (error, post) => {
        res.redirect('/')
    })
});

app.listen(4000, () => {
  console.log("App listening on port 4000");
});
