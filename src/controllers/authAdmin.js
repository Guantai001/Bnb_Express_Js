const Admin = require('../database/schemas/Admin');
const {
    hashPassword,
    comparePassword
} = require('../utils/helpers');

// register admin
async function registerAdmin(req, res) {
    const {
        name,
        email,
        password
    } = req.body;
    const adminDb = await Admin.findOne({
        email
    }); // check if admin already exists
    if (adminDb) {
        return res.status(400).json({
            message: "Admin already exists"
        });
    } else {
        const password = await hashPassword(req.body.password);
        console.log(password);
        const newAdmin = new Admin({
            name,
            email,
            password
        });
        await newAdmin.save();
        return res.status(201).json({
            message: "Admin created successfully"
        });
    }

}

// login admin
async function loginAdmin(req, res) {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter all fields"
        });
    }
    const adminDb = await Admin.findOne({ email });
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
    }else {
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
    registerAdmin,
    loginAdmin
};