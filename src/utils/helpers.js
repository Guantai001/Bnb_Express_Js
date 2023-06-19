const bcrypt = require('bcryptjs');

//used to hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

//used to compare password
const comparePassword = async (password, hash) => {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}

//exporting the functions
module.exports = { hashPassword, comparePassword };