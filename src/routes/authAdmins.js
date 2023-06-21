const {Router} = require('express');
const router = Router();

const passport = require('passport');
const Admin = require('../database/schemas/Admin');
const {hashPassword, comparePassword} = require('../utils/helpers');
const { registerAdmin, loginAdmin } = require('../controllers/authAdmin');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');


// register admin
// router.post('/register',registerAdmin);
// login admin
router.post('/login', loginAdmin);
// logout admin
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({
        message: "Logged out successfully"
    });
});


router.post('/register', upload.single("image"), async (req, res) => {
    try {
        // check if email already exists
        const { email } = req.body;
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }


        const result = await cloudinary.uploader.upload(req.file.path);
        let admin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            image: result.secure_url
        });
        admin.password = await hashPassword(admin.password);
        await admin.save();
        res.status(201).json({
            message: "Admin created successfully",
            admin
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create admin",
            error: error.message
        });
    }
});



module.exports = router;

