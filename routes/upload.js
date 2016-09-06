var database = require('../createdata');


var mime = require('mime-types');
var multer  =   require('multer');
var HttpError = require('../error/').HttpError;
var shortPath = '/assets/img/works/';
var fullPath = './public' + shortPath;

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, fullPath);
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
    }
  });


exports.post = function(req, res, next) {
 
  var upload = multer({ storage : storage}).single('photo');
  

  upload(req, res, function(err) {
    if(err) {
      return next(new HttpError(404, 'error loading file'));
    }
    var filePath = shortPath + req.file.filename;

    var data = {
      'title': req.body.title, 
      'tech': req.body.tech,
      'filename': req.file.filename,
      'src': filePath
    };
   console.log(req.body.title);
    console.log(req.body.tech);
    console.log(req.file.filename);
    console.log(filePath);

    database.saveData(data, res, next);
    res.end("File is uploaded");

  });
 
}

exports.get = function(req, res) {
  
  res.render('upload', {
    title: 'Upload',
    message: 'Hello everybody !'
      
  });
  
};
