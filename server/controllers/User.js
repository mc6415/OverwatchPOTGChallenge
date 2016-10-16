var User = require('../models/user');
const sha256 = require('sha256');
const randomstring = require('randomstring');
var POTG = require('../models/potg');

module.exports.create = function(req,res){
    var user = new User();
    console.log(user);
    var salt = randomstring.generate(10);
    var pepper = randomstring.generate(10);

    user.username = req.body.username;
    user.email = req.body.email;
    user.salt = salt;
    user.pepper = pepper;
    user.password = sha256(salt) + sha256(req.body.password) + sha256(pepper);
    user.battletag = req.body.battletag.replace("#", "-");

    user.save();

    res.status(201).redirect('/');
}


module.exports.login = function(req,res){
    User.find({'username' : req.body.username}, function(err, docs){
      if(docs.length > 0){
        var pass = sha256(docs[0].salt) + sha256(req.body.password) + sha256(docs[0].pepper);
        if(pass == docs[0].password){
          var uid = docs[0]._id;
          res.cookie('user', JSON.stringify(docs[0]));
          res.redirect('/');
        } else {
          res.redirect('/error')
        }
      } else {
        res.redirect('/error')
      }
    })
}

module.exports.SignOut = function(req,res){
  res.clearCookie('user');
  res.redirect('/');
}

module.exports.View = function(req,res){
      POTG.find({user: req.params.id}, function(err,docs){
        res.render('test', {potg: docs})
      })
}

module.exports.ViewAll = function(req,res){
  User.find({}, function(err,docs){
    res.render('UserList', {users: docs})
  })
}
