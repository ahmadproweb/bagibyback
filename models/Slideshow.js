const mongoose = require('mongoose');

const slideshowSchema = new mongoose.Schema({
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length === 1; 
      },
      message: 'Only one image can be uploaded at a time.',
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Slideshow', slideshowSchema);
