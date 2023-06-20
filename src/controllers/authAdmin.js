const Admin = require('../database/schemas/Admin');
const {
    hashPassword,
    comparePassword
} = require('../utils/helpers');
const multer = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');



// register admin
async function registerAdmin(req, res) {
    const { name, email, password } = req.body;

    const adminDb = await Admin.findOne({ email }); // check if admin already exists
    if (adminDb) {
        return res.status(400).json({
            message: "Admin already exists"
        });
    } else {
        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword);

        // Upload image to cloudinary using multer and cloudinary modules
        const upload = multer.single('image'); // assuming the field name for the image is 'image' in the request body

        upload(req, res, async function (err) {
            if (err instanceof Error) { // Use instanceof Error instead of multer.MulterError
                return res.status(500).json({
                    message: "Image upload failed",
                    error: err.message
                });
            } else if (err) {
                return res.status(500).json({
                    message: "Image upload failed",
                    error: err.toString()
                });
            }

            // Image upload successful, save admin details with image URL
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                const image = result.secure_url;

                const newAdmin = new Admin({
                    name,
                    email,
                    password: hashedPassword,
                    image
                });
                await newAdmin.save();

                return res.status(201).json({
                    message: "Admin created successfully"
                });
            } catch (error) {
                return res.status(500).json({
                    message: "Image upload failed",
                    error: error.toString()
                });
            }
        });
    }
}





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
    registerAdmin,
    loginAdmin
};