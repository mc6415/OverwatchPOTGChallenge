const mongoose = require('mongoose');

module.exports = mongoose.model('POTG', {
  user: {type: String},
  image: {type: String},
  character: {type: String},
  createdDate: {type: String}
})
