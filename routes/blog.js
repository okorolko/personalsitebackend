var Blog = require('../models/blogs').Blog;

exports.get = function(req, res) {
  Blog.find({}, function(err, posts) {
    if (err) return next(err);
    res.render('blog', {posts: posts.reverse()});
  })
};

