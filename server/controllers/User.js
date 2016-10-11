var User = require('../models/user');
const sha256 = require('sha256');
const randomstring = require('randomstring');

module.exports.create = function(req,res){
    var user = new User();

    var salt = randomstring.generate(7);

    user.username = req.body.username;
    user.email = req.body.email;
    user.salt = salt;
    user.password = sha256(salt) + sha256(req.body.password)
    user.battletag = req.body.battletag.replace("#", "-");

    user.save();

    res.send(user);
}


module.exports.login = function(req,res){
    User.find({'username' : req.body.username}, function(err, docs){
      if(docs.length > 0){
        var pass = sha256(docs[0].salt) + sha256(req.body.password);
        if(pass == docs[0].password){
          var uid = docs[0]._id;
          res.cookie('user', docs[0]);
          res.redirect('/');
        } else {
          res.redirect('/error')
        }
      } else {
        res.redirect('/error')
      }
    })
}
