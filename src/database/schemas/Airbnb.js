const mongoose = require('mongoose');

const AirbnbSchema = new mongoose.Schema({

    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    location: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    price: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    beds: {
        type: mongoose.Schema.Types.Number,
        required: true
    },

    category: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    description: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    admin : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    image: {
        type: mongoose.Schema.Types.String,
        required: true
    }


});

module.exports = mongoose.model('airbnb', AirbnbSchema);
