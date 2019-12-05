var express=require('express')
var router=express.Router()
var User=require('../models/user')
var Blog=require('../models/blog')
var passport=require('passport')

router.get('/login', function (req, res) {
    res.render('login')
  })
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/blog',
    failureRedirect: '/login'
  }), function (req, res) {
    req.flash('success','Logged in sucessfully')
  })
  
  router.get('/register', function (req, res) {
    res.render('register')
  })
  router.post('/register', function (req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
      if (err) {
        req.flash('error', err.message)
        res.redirect('/register')
      } else {
        passport.authenticate('local')(req, res, function () {
          req.flash('success','user registration successful')
          res.redirect('/blog')
        })
      }
    })
  })
  router.get('/logout', function (req, res) {
    req.flash('success','Logged out sucessfully')
    req.logout()
    res.redirect('/')
  })
  function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        req.flash('error', 'Please login')
        res.redirect('/login')
    }

}

module.exports=router