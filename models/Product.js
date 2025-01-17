const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    thumbnailImage: [{ type: String, required: true }],
    images: [{ type: String }] 
});

const productSchema = new mongoose.Schema({
    homeProduct: { type: String, required: true },
    title: { type: String, required: true },
    // filterProducts: { type: String, required: true },
    star: { type: Number, required: true },
    mainPrice: { type: Number, required: true },
    fakeSold: { type: Number },
    discountPrice: { type: Number, required: true },
    mainImage: { type: String, required: true },
    thumbnails: [imageSchema], 
    description: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
      },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
