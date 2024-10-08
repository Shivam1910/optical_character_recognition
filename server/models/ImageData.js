const mongoose = require('mongoose');

const imageDataSchema = new mongoose.Schema({
    imageUrl: String,
    originalText: String,
    translatedText: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ImageData', imageDataSchema);
