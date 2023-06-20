const mongoose = require('mongoose');

const BnbImageSchema = new mongoose.Schema({
    image: {
        type: mongoose.Schema.Types.String,
        required: true
    }
});

module.exports = mongoose.model('bnb_image', BnbImageSchema);