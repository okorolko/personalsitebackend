var Diagram = require('../models/diagram').Diagram;

exports.get = function(req, res) {
  Diagram.find({}, function(err, diagram) {
    if (err) return next(err);
    res.render('aboutme', {});
  })

};
