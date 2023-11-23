// Create web server

// Dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Comment = require('../models/comment');
var Post = require('../models/post');

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));

// GET
router.get('/', function(req, res, next) {
  res.send('Comments!');
});

// POST
router.post('/', function(req, res, next) {
  var newComment = new Comment({
    username: req.body.username,
    content: req.body.content,
    post: req.body.post
  });

  newComment.save(function(err, comment) {
    if (err) return console.error(err);
    console.log(comment);

    Post.findByIdAndUpdate(
      req.body.post,
      { $push: { comments: comment._id } },
      { new: true },
      function(err, post) {
        if (err) return console.error(err);
        console.log(post);
        res.redirect('/posts/' + req.body.post);
      }
    );
  });
});

// Export
module.exports = router;