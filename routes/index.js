var checkAuth = require('../middleware/checkAuth');


module.exports = function(app) {
  app.get('/', require('./mainpage').get);
  app.get('/login', require('./login').get);
  app.get('/admin', checkAuth,require('./admin').get);
  app.get('/blog', require('./blog').get);
  app.get('/works', require('./works').get);
  app.get('/aboutme', require('./aboutme').get);
  app.get('/getdiagram', require('./diagram').get);
  app.post('/login', require('./login').post);
  app.post('/logout', require('./logout').post);
  app.post('/diagram', require('./diagram').post);
  app.post('/addnote', require('./addnote').post);
  app.post('/addblogpost', checkAuth,require('./addblogpost').post);
  app.post('/del', require('./del').post);
  app.get('/users', require('./users').get);
  app.get('/user/:id', require('./userid').get);
  app.post('/upload', checkAuth, require('./upload').post);

};
