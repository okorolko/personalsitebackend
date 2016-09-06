var mongoose = require('./libs/mongoose'),
    async = require('async');
   work = require('./models/works').Work;

function saveData (data, res, next) {
  var work = new mongoose.models.Work({
    title: data.title,
    tech: data.tech,
    filename: data.filename,
    src: data.src
  });
  try {
    work.save();
  } catch (e) {
    return next(err);
  }

}

function removeData (res, next) {
  mongoose.connection.db.dropCollection('works', function(err, result) {
    if (err) return next(err);
  });
  console.log('collection dropped')
   res.writeHead(200, {"Content-Type": "text/plain"});
   res.end('ok');
}


exports.saveData = saveData;
exports.removeData = removeData;
