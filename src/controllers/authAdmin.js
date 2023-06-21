const Admin = require('../database/schemas/Admin');
const {
    hashPassword,
    comparePassword
} = require('../utils/helpers');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');



// async function registerAdmin(req, res) {

// Register admin

// async function registerAdmin(req, res) {
//     const { name, email, password } = req.body;
//     try {
//         // Check if admin already exists
//         const adminExists = await Admin.findOne({ email });
//         if (adminExists) {
//             return res.status(400).json({ message: 'Admin already exists' });
//         }
//         // Upload image to cloudinary
//         const result = await cloudinary.uploader.upload(req.file.path);
//         const adminImage = new Image({
//             image: result.secure_url,
//         });
//         // Create a new instance of the Admin model
//         const admin = new Admin({ name, email, password, image: adminImage });
//         // Hash the admin's password
//         admin.password = await hashPassword(password);
//         // Save the admin to the database
//         const savedAdmin = await admin.save();
//         return res.status(201).json({
//             message: 'Admin created successfully',
//             admin: savedAdmin
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: 'Failed to create admin',
//             error: error.message
//         });
//     }
// }





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