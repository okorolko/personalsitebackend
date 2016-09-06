var database = require('../creatediagramvalues');
var Diagram = require('../models/diagram').Diagram;

exports.post = function(req, res, next) {
  var data = {
    'html': req.body.html,
    'css': req.body.css,
    'js': req.body.javascript,
    'sass': req.body.sass,
    'git': req.body.git,
    'gulp': req.body.gulp,
    'bower': req.body.bower,
    'php': req.body.php,
    'nodejs': req.body.nodejs,
    'mongodb': req.body.mongodb

  };
  database.saveData(data, res, next);
};

exports.get = function(req, res, next) {
  Diagram.find({}, function(err, users) {
    if (err) return next(err);
    res.json(users);
  });
};