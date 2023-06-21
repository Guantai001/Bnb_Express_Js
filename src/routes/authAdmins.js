const {Router} = require('express');
const router = Router();

const passport = require('passport');
const Admin = require('../database/schemas/Admin');
const {hashPassword, comparePassword} = require('../utils/helpers');
const { registerAdmin, loginAdmin } = require('../controllers/authAdmin');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');



router.post('/login', loginAdmin);
// logout admin
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({
        message: "Logged out successfully"
    });
});

// get all admins
router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json({
            message: "Admins fetched successfully",
            admins
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch admins",
            error: error.message
        });
    }
});

// get admin by name
router.get('/:id', async (req, res) => {
    try {
        const admin = await Admin.findOne({ _id: req.params.id });
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }
        res.status(200).json({
            message: "Admin fetched successfully",
            admin
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch admin",
            error: error.message
        });
    }
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

// // update admin profile image, name, email

router.patch('/:id', upload.single("image"), async (req, res) => {
    try {
      const { name, email } = req.body;
      const admin = await Admin.findById(req.params.id);
  
      if (!admin) {
        return res.status(404).json({
          message: "Admin not found"
        });
      }
  
      if (name) {
        admin.name = name;
      }
  
      if (email) {
        admin.email = email;
      }
  
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        admin.image = result.secure_url;
      }
      await admin.save();
      res.status(200).json({
        message: "Admin updated successfully",
        admin
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update admin",
        error: error.message
      });
    }
  });
  


module.exports = router;

