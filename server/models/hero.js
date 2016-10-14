const mongoose = require('mongoose');

module.exports = mongoose.model('Hero', {
  image: {type: String},
  name: {type: String}
})
