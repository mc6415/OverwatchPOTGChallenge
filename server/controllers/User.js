var User = require('../models/user');
const sha256 = require('sha256');
const randomstring = require('randomstring');

module.exports.create = function(req,res){
    var user = new User();

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
  res.status(201).redirect('/');
}
