var Work = require('../models/works').Work;

exports.get = function(req, res) {
  Work.find({}, function(err, works) {
    if (err) return next(err);
    res.render('works', {works: works});
  })

};