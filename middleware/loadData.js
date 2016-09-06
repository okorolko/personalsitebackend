var Work = require('../models/works').Work;

module.exports = function(req, res, next) {
  Work.find({}, function(err, notes) {
    if (err) return next(err);
    req.notes = res.locals.notes = notes;
    next();
  });
};

