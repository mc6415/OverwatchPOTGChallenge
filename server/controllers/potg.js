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
