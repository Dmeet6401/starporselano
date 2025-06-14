const mongoose = require('mongoose');

const tileSchema = new mongoose.Schema({
  tile_name: {
    type: String,
    required: true
  },
  tile_photo: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  tile_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TileType',
    required: true
  },
  tile_size_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TileSize',
    required: true
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tile', tileSchema); 