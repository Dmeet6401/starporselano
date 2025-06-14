const mongoose = require('mongoose');

const tileTypeSchema = new mongoose.Schema({
  tile_type_name: {
    type: String,
    required: true
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TileType', tileTypeSchema); 