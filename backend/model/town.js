const mongoose = require('mongoose');

const TownSchema = new mongoose.Schema({
  town: {
    type: String,
  },
  
});

module.exports = mongoose.model('Town', TownSchema);
