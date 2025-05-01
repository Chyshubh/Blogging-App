const path = require('path')
const express = require('express');
const mongoose = require('mongoose');
const cookiePaser = require('cookie-parser');

const Blog = require('./models/blog')

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const { checkForAuthCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT || 8000;

mongoose
.connect('mongodb://127.0.0.1:27017/blogfy')
.then(e = console.log('MongoDB Connected Succesfully'));

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({extended: false}))
app.use(express.static(path.resolve("./public")))
app.use(cookiePaser());
app.use(checkForAuthCookie("token"));

app.get('/', async (req, res)=>{
    const allBlogs = await Blog.find({})
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });

});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, ()=>{console.log(`Server Started at:${PORT}`)});
