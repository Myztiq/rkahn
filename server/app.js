var fbGallery = require('./fbGallery/fbGallery.js'),
http = require('http'),
express = require('express'),
stylus = require('stylus'),
app = express.createServer();

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'Whoa, Pants' }));
  app.use(express.favicon(__dirname+'/../browser/images/favicon.ico'));

  app.set('views', __dirname + '/../browser/views');
  app.use(stylus.middleware({
    src: __dirname + '/../browser',
    compile: function(str, path) { // optional, but recommended
      return stylus(str)
      .set('filename', path)
      .set('warn', true)
      .set('compress', true);
    }
  }));
  app.use(app.router);
//  express.favicon();
  app.use(express.static(__dirname + '/../browser'));

});



fbGallery.init("AAAECI9o4wTkBAJ8H2HYtvRIJZB6YCN26ud1q3bUFYqEYDqzkoG7IMehS69Cihc183dX5gsF6SPETkhRs7EkdF11rwhUcZD");
app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});

app.get('/update',function(req,res){
  fbGallery.updatePhotoGalleries();
  res.send("Updating..");
});

app.get('/photos',function(req,res){
  fbGallery.getPhotoGalleries(function(galleries){
    res.render("gallery",{galleries:galleries});
  });
});
app.get('/favicon.ico',function(req,res){
	res.send();
});

app.get('/:url',function(req,res){
	res.render(req.params.url);
});
app.get('/',function(req,res){
	res.render('index');
});

app.post('/gallery/:id',function(req,res){
  fbGallery.getPhotoGalleries(function(gallery){
    res.send(JSON.stringify(gallery));
  },req.params.id);
});


app.error(function(err, req, res, next){
  console.log(err);
  res.send('There was an error.');
});


exports.app = app;

console.log('rkahn started');
