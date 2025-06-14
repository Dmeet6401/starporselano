const mongoose = require('mongoose');

const tileSizeSchema = new mongoose.Schema({
  tile_size_name: {
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

module.exports = mongoose.model('TileSize', tileSizeSchema); 