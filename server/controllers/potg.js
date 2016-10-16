var POTG = require('../models/potg');

module.exports.create = function(req,res){
  var potg = new POTG();

  potg.user = req.body.username;
  potg.character = req.body.hero;
  potg.createdDate = new Date();

  if(typeof(req.file) == 'undefined'){
    potg.link = req.body.youtube
  } else {
    potg.image = req.file.buffer.toString('base64');
  }

  potg.save();''

  res.redirect('/')
}

module.exports.check = function(req,res){
  POTG.find({user: req.body.username, character: req.body.hero}, function(err,docs){
    console.log(docs);
    res.send(docs);
  })
}

module.exports.getUser = function(req,res){
  POTG.find({user: req.body.username}, function(err, docs){
    res.send(docs);
  })
}

module.exports.remove = function(req,res){
  var id = req.params.id;
  POTG.remove({_id : id}, function(){
    res.redirect('/');
  })
}
