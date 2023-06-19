const mongoose = require('mongoose');

const GoogleUserSchema = new mongoose.Schema({
   googleId: {
         type: mongoose.Schema.Types.String,    
            required: true,
            unique: true
    }


});

module.exports = mongoose.model('google_user', GoogleUserSchema);