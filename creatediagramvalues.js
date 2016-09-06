var mongoose = require('./libs/mongoose');
var  async = require('async');
Diagram = require('./models/diagram').Diagram;

function saveData (data, res, next) {
  var diagram = new mongoose.models.Diagram({
    html: data.html,
    css: data.css,
    js: data.js,
    sass: data.sass,
    git: data.git,
    gulp: data.gulp,
    bower: data.bower,
    php: data.php,
    nodejs: data.nodejs,
    mongodb: data.mongodb
  });

  try {
    Diagram.findByIdAndUpdate('579d169d0467df0a3432e7ef', {$set: data}, {upsert: true, new: true}, function(err) {
      if(err) return next(err);
    });
  } catch (e) {
    return next(e);
  }
  res.end('ok');
}

exports.saveData = saveData;

