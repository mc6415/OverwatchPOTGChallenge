var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html'),
    express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    controllers = require('./server/controllers/Namespace.js'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser');
    multer = require('multer');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

mongoose.connect('mongodb://mc6415:owpotg@ds033956.mlab.com:33956/ow_potg')
app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
var upload = multer({ storage: multer.memoryStorage({}) });
app.use('/', express.static(__dirname + '/public/views'));
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/css', express.static(__dirname + '/public/css'))

app.get('/', function(req,res){
  if(req.cookies.user != undefined){
    res.redirect('/dash')
  }
  res.sendFile(__dirname + '/public/views/login.html')
})

app.get('/dash', function(req,res){
  if(req.cookies.user == undefined){
    res.redirect('/');
  }
  res.sendFile(__dirname + '/public/views/heroList.html')
})

app.get('/api/User/SignOut', controllers.User.SignOut);
app.get('/User/View/:id', controllers.User.View);
app.get('/User/ViewAll', controllers.User.ViewAll);
app.get('/api/potg/remove/:id', controllers.Potg.remove);

app.post('/api/potg/create', upload.single('potg'), controllers.Potg.create);
app.post('/api/Heroes/getAll', controllers.Heroes.getAll);
app.post('/api/User/create', controllers.User.create);
app.post('/api/User/login', controllers.User.login);
app.post('/api/potg/checkHero', controllers.Potg.check);
app.post('/api/potg/getUser', controllers.Potg.getUser);

// Listen on port 3000, IP defaults to 127.0.0.1
app.listen(port, function(){
  console.log("Server now listening on port " + port);
})
