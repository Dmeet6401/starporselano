const mongoose = require('mongoose');

const brochureSchema = new mongoose.Schema({
  brochure_name: {
    type: String,
    required: true
  },
  brochure_url: {
    type: String,
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

module.exports = mongoose.model('Brochure', brochureSchema); 