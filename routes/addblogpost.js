var database = require('../createblogpost');

exports.post = function(req, res, next) {
  var data = {
    'title': req.body.title,
    'date': req.body.date,
    'content': req.body.content
  };
  console.log(data)
  database.saveData(data, res, next);

};