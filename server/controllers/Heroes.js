const battletag = 'Coombes-11373'
const https = require('https');
const Hero = require('../models/hero')
const User = require('../models/user')

function getHero(name, img) {
    return {
        'name': name,
        'img': img
    }
}

module.exports.getAll = function(req, res) {
    var hero = new Hero();
    Hero.find({}, function(err, docs) {
        if (docs.length > 0) {
            res.send(docs);
        } else {
            var url = 'https://api.lootbox.eu/pc/eu/' + req.body.battletag + '/quick-play/heroes';

            https.get(url, function(r) {
                var test = ''
                r.on('data', function(chunk) {
                    r.setEncoding('utf8');
                    test += chunk;
                })
                r.on('end', function() {
                    var heroes = JSON.parse(test);
                    heroes.forEach(function(h){
                      var hero = new Hero();
                      hero.name = h.name;
                      hero.image = h.image;
                      hero.save();
                    })
                    res.send(heroes)                  
                })
            })
        }
    })
}
