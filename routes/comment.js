var Blog=require('../models/blog')
var User=require('../models/user')
var express = require('express')
var router = express.Router()
var mongoose=require('mongoose')
var santizeHTML = require('sanitize-html')
var Comment = require('../models/comment')

router.get('/blog/:id/comment/new',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err || !foundBlog){
            console.log(err)
            req.flash('error','Something went wrong. Please try again after sometime')
            res.redirect('/')
        }
        res.render('comments/addcomment',{foundBlog:foundBlog})    
    })
    
})

router.post('/blog/:id/comment/',function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err || !foundBlog){
        req.flash('Something went wrong. Please try after sometim')
        res.redirect('/')
    }
    else{
        Comment.create(req.body.comment,function(err,comment){
            if(err) {res.redirect('/')
        console.log(err)}
            else{
                comment.author.id= req.user._id
                comment.author.username = req.user.username
                comment.save()
                console.log(comment)
                console.log(foundBlog)
                foundBlog.comments.push(comment)
                foundBlog.save()
                console.log(foundBlog.comments)
                req.flash('sucess','Comment added sucessfully')
                res.redirect('/blog/'+foundBlog._id)
            }
        })
    }

  })
})

module.exports=router