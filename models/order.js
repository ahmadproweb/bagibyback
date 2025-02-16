const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  contact: {
    phone: { type: String, required: true },
    alternativePhone: { type: String },
  },
  address: {
    addressComplete: { type: String, required: true },
    famousPlace: { type: String},
    city: { type: String, required: true },
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    cartImage: { type: String, required: true },
  }],
  total: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
