var express = require('express'), //
    app = require('express')(), //
    http = require('http'), //
    path = require('path'), //
    util = require('util'),
    errorHandler = require('errorhandler'), //
    config = require('./config/'), // config //
    logger = require('morgan'), // logger  //
    bodyParser = require('body-parser'), // парсеры  //
    sassMiddleware = require('node-sass-middleware'), //
    cookieParser = require('cookie-parser'), //
    favicon = require('serve-favicon'), // favicon  //
    mongoose = require('./libs/mongoose'), // for mongo  //
    session = require('express-session'); // sessions



// view engine setup
app.set('views', path.join(__dirname, '/templates'));
app.set('view engine', 'jade');

if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('default'));
}


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));// support encoded bodies


//req.cookies
app.use(cookieParser('secret your key')); 

//session
var MongoStore = require('connect-mongo')(session);


app.use(session({
  secret: config().get('session:secret'),
  key: config().get('session:key'),
  cookies: config().get('session:cookies'),
  store: new MongoStore({
    url: config().get('mongoose:uri'),
    mongoOptions: config().get('mongoose:options'),
    mongoose_connection: mongoose.connection
  }),
  resave: config().get('session:resave'),
  saveUninitialized: config().get('session:saveUninitialized')
}));


//sass
app.use(sassMiddleware({
  src: path.join(__dirname),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  debug: true,
  outputStyle: 'compressed',
  sourceMap: true
}));

// middleware
app.use(require('./middleware/sendHttpError'));

app.use(require('./middleware/LoadUser')); 

app.use(require('./middleware/LoadData')); 

// routes
require('./routes')(app); 

app.use(express.static(path.join(__dirname, 'public')));

//--------------------  обработка ошибки  ------------------//
var  HttpError = require('./error/').HttpError;
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new HttpError(404, 'Sorry, Page Not Found');
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  if (typeof err == 'number') {
    err = new HttpError(err);
  }
  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') === 'development') {
      var errorhandler = errorHandler();
      errorhandler(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});


//-------------------------server start ----------------------------//
http.createServer(app).listen(config().get('port'), function(){  // запускаем сервер
  console.log('express server listening on port : ' + config().get('port'));
});


