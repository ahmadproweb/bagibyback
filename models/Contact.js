const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    email: { type: String, required: true,},
    phoneNumber: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
      },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
