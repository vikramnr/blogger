require('dotenv').config()
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var methodOverride = require('method-override')
var flash = require('connect-flash')
var passport = require('passport')
var LocalStrategy = require('passport-local')
var passportLocalMongoose = require('passport-local-mongoose')
var Blog = require('./models/blog')
var User = require('./models/user')
var blogRouter=require('./routes/blog')
var indexRouter=require('./routes/index')
var commentRouter= require('./routes/comment')
var santizeHTML = require('sanitize-html')
app.set('view engine', 'ejs')
app.use(bodyParser.json(true))
app.use(bodyParser.urlencoded({
  extended: 'false'
}))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(require('express-session')({
  secret: process.env.SESSION,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(flash())


mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECTION}`, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('Connection Sucessful')
  }
})
app.use(function (req, res, next) {
  res.locals.username = req.user;
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  
  next()
})
app.use(blogRouter)
app.use(commentRouter)
app.use(indexRouter)
app.use(function (err, req, res, next) {
  console.error(err.stack)
  req.flash('error','Something went wrong.. Redirected to home page')
  res.redirect('/')
})
app.get('*',function(req,res){
  res.redirect('/')
})
app.listen(process.env.PORT||5000, process.env.IP);
