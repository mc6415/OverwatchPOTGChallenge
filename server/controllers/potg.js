var POTG = require('../models/potg');

module.exports.create = function(req,res){
  var potg = new POTG();

  potg.character = "Zarya";
  potg.user = "Coombes";
  potg.image = "http://localhost:3000/api/potg/create";
  potg.createdDate = new Date().toISOString();

  potg.save();

  console.log(potg);

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
