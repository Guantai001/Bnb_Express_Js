const mongoose = require('mongoose');

const AmenitySchema = new mongoose.Schema({
    item1 : {
        type: mongoose.Schema.Types.String,
        required: true
    },
    item2 : {
        type: mongoose.Schema.Types.String,
        required: true
    },
    item3 : {
        type: mongoose.Schema.Types.String,
        required: true
    },
    item4 : {
        type: mongoose.Schema.Types.String,
        required: true
    },
    item5 : {
        type: mongoose.Schema.Types.String,
        required: true
    },
    item6 : {
        type: mongoose.Schema.Types.String,
        required: true
    },
    // link to airbnb
    airbnb : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'airbnb',
        required: true
    }
});

module.exports = mongoose.model('amenity', AmenitySchema);