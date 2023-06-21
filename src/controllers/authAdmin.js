const Admin = require('../database/schemas/Admin');
const {
    hashPassword,
    comparePassword
} = require('../utils/helpers');


// login admin
async function loginAdmin(req, res) {
    const {
        email,
        password
    } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter all fields"
        });
    }
    const adminDb = await Admin.findOne({
        email
    });
    if (!adminDb) {
        return res.status(400).json({
            message: "Email or password is incorrect"
        });
    }
    const isMatch = await comparePassword(password, adminDb.password);
    if (isMatch) {
        req.session.admin = adminDb;
        return res.status(200).json({
            message: "Login successful"
        });
    } else {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }
}

// logout admin
function logoutAdmin(req, res) {
    req.session.destroy();
    return res.status(200).json({
        message: "Logout successful"
    });
}


module.exports = {

    loginAdmin
};