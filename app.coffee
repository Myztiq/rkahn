express = require 'express'
http = require 'http'
path = require 'path'
less = require 'less-middleware'
nunjucks = require 'nunjucks'
expressCoffee = require 'express-coffee'

app = express()

serverURL = 'localhost:3000'
if process.env.serverURL?
  serverURL = process.env.serverURL


app.configure ->
  env = new nunjucks.Environment(new nunjucks.FileSystemLoader('templates'))
  env.express(app)
  app.use express.errorHandler()

  app.use expressCoffee
    path: __dirname + '/public'
    live: true
    uglify: false

  bootstrapPath = path.join(__dirname, 'node_modules', 'bootstrap');
  l3Path = path.join(__dirname, 'node_modules', 'l3');

  app.use less
    paths: [path.join(bootstrapPath, 'less'), path.join(l3Path, 'less')]
    src: path.join __dirname, 'public/less'
    once: false
    prefix : '/stylesheets'
    dest   : path.join(__dirname, 'public', 'stylesheets'),

  app.use express.favicon __dirname + '/public/images/favicon.ico'
  app.use express.static __dirname + '/public'

  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router


app.get '/', (req, res)->
  res.render 'index.html'

app.get '/contact', (req, res)->
  res.render 'contact.html'

app.get '/about', (req, res)->
  res.render 'contact.html'

app.get '/projects', (req, res)->
  res.render 'projects.html'

app.get '/presentations', (req, res)->
  res.render 'presentations.html'

app.get '/photos', (req, res)->
  res.render 'photos.html'

app.use (err, req, res, next)->
  throw err
  res.status 500
  res.render '500.html'

app.use (req, res)->
  res.status 404
  res.render '404.html'

http.createServer(app).listen process.env.PORT or 3000

console.log "Server running - on port " +(process.env.PORT or 3000)
