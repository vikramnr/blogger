var express = require('express')
var router = express.Router()
var Blog = require('../models/blog')
var User = require('../models/user')
var mongoose = require('mongoose')
var santizeHTML = require('sanitize-html')
router.get('/', function (req, res) {
    res.redirect('/blog')
})
router.get('/blog', function (req, res) {
    Blog.find({}, function (err, result) {
        if (err || !result) {
            req.flash('error', 'Something went wrong. Please try after some time')
            console.log(err)
        } else {
            res.render('blog', {
                blog: result
            })

        }
    })
})

router.get('/blog/new', isLogged, function (req, res) {
    res.render('newblog')
})
router.post('/blog', isLogged, function (req, res) {
    var body = santizeHTML(req.body.blogbody)
    var title = req.body.title
    var image = req.body.image
    var date = req.body.date
    var blogObj = {
        title: title,
        image: image,
        body: body,
        date: date
    }
    Blog.create(blogObj, function (err, request) {
        if (err || !request) {
            console.log(err)
            req.flash('error', 'Something went wrong. Please try after some time')
            res.redirect('/blog/new')
        } else {
            req.flash('success', 'Post created sucessfully')
            res.redirect('/blog')
        }
    })
})
router.get('/blog/:id', isLogged, function (req, res) {
    Blog.findById(req.params.id).populate('comments').exec(function (err, result) {
        if (err || !result) {
            req.flash('error', 'Something went wrong. Please try after some time')
            res.redirect('/blog')
        } else {
            res.render('showblog', {
                blog: result
            })
            console.log(result)
            console.log(result.comments[0])
        }
    })
})

router.get('/blog/:id/edit', function (req, res) {
    Blog.findById(req.params.id, function (err, result) {
        if (err || !result) {
            req.flash('error', 'Something went wrong. Please try after some time')
            res.redirect('/blog')
        } else {
            res.render('editblog', {
                blog: result
            })
        }
    })
})
router.put('/blog/:id', isLogged, function (req, res) {
    req.body.blog.body = santizeHTML(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, result) {
        if (err || !result) {
            req.flash('error', 'Something went wrong. Please try after some time')
            res.redirect('/blog')
        } else {
            req.flash('success', 'Post has been updated sucessfully')
            res.redirect('/blog/' + req.params.id)
        }
    })
})
router.delete('/blog/:id', isLogged, function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err)
        } else {
            req.flash('success', 'Post has been taken down')
            res.redirect('/blog')
        }
    })
})

function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        req.flash('error', 'Please login')
        res.redirect('/login')
    }

}

module.exports = router