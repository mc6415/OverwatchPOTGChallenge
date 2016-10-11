const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const controllers = require('./server/controllers/namespace.js');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

mongoose.connect('mongodb://mc6415:owpotg@ds033956.mlab.com:33956/ow_potg')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/', express.static(__dirname + '/public/views'));
app.use('/js', express.static(__dirname + '/public/js'))

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

app.get('/api/Heroes/getAll', controllers.Heroes.getAll);
app.get('/api/potg/create', controllers.Potg.create);

app.post('/api/User/create', controllers.User.create);
app.post('/api/User/login', controllers.User.login);

app.listen(5000, function(){
  console.log("Server now listening on port 3000");
})
