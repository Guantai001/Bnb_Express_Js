const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    from_date: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    to_date: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    airbnb: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'airbnb',
        required: true
    },
    estimated_amount: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    difference_in_nights: {
        type: mongoose.Schema.Types.Number,
        required: true
    }
});
