const {
    Router
} = require('express');
const router = Router();
const passport = require('passport');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const User = require('../database/schemas/User');
const {
    hashPassword,
    comparePassword
} = require('../utils/helpers');


const {

    loginUser
} = require('../controllers/authUser');
const {
    route
} = require('./bnbImage');

// login user
router.post('/login', loginUser);

// logout user
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({
        message: "Logged out successfully"
    });
});

// Google OAuth
router.get('/google', passport.authenticate('google'), (req, res) => {
    console.log(req.user);
    res.send('Logged in');
});

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    console.log(req.user);
    req.session.user = req.user;
    res.send('Logged in');
});


// Register user
// async function registerUser(req, res) {
//     const { name, email, password, registrationMethod } = req.body;
//     // Check if the user already exists
//     const userDb = await User.findOne({ email });
//     if (userDb) {
//       return res.status(400).json({ message: "User already exists" });
//     } else {
//       let newUser;
//       if (registrationMethod === 'google') {
//         // Registering with Google
//         newUser = new GoogleUser({ name, email, googleId: 'generatedGoogleId' });
//       } else {
//         // Registering with local authentication
//         const hashedPassword = await hashPassword(password);
//         newUser = new User({ name, email, password: hashedPassword });
//       }

//       await newUser.save();
//       return res.status(201).json({ message: "User created successfully" });
//     }
//   }

// get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            users
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});



router.post('/register', upload.single('image'), async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            registrationMethod
        } = req.body;
        const userDb = await User.findOne({
            email
        });
        if (userDb) {
            return res.status(400).json({
                message: "User already exists"
            });
        } else {
            let newUser;
            if (registrationMethod === 'google') {
                newUser = new GoogleUser({
                    name,
                    email,
                    googleId: 'generatedGoogleId'
                });
            } else {
                const result = await cloudinary.uploader.upload(req.file.path);
                let newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    image: result.secure_url,

                });
                newUser.password = await hashPassword(newUser.password);
                await newUser.save();
                return res.status(201).json({
                    message: "User created successfully",
                    newUser
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

// update user
router.patch('/:id', upload.single("image"), async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.params.id );
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            user.image = result.secure_url;
        }
        await user.save();
        return res.status(200).json({
            message: "User updated successfully",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

// delete user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});


module.exports = router;