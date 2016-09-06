var mongoose = require('./libs/mongoose');
var  async = require('async');
 blog = require('./models/blogs').Blog;

function saveData (data, res, next) {
  var blog = new mongoose.models.Blog({
    title: data.title,
    date: data.date,
    content: data.content
  });
  try {
    blog.save();
  } catch (e) {
    return next(err);
  }
  res.end('ok');
}

exports.saveData = saveData;

