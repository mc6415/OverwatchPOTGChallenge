const battletag = 'Coombes-11373'
const https = require('https');

function getHero(name, img){
  return {
    'name': name,
    'img': img
  }
}

module.exports.getAll = function(req,res){
  var url = 'https://api.lootbox.eu/pc/eu/'+ battletag +'/quick-play/heroes'
  var output = '';
  https.get(url, function(r){
    r.setEncoding('utf8');
    r.on('data', function(chunk){
      var heroes = []
      var test = JSON.parse(chunk);
      test.forEach(function(hero){
        heroes.push(getHero(hero.name, hero.image));
      })
      res.send(heroes);
    })
  })

  console.log(output);
}
