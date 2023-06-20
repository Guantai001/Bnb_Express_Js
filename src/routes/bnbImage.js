const {
    Router
} = require('express');
const router = Router();
const Image = require('../database/schemas/BnbImage');
const uploader = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');


router.use((req, res, next) => {
    if (req.session.user) {
        console.log(req.session.user);
        next();
    } else if (req.session.admin) {
        console.log(req.session.admin);
        next();
    } else {
        res.status(401).json({
            message: "Unauthorized"
        });
    }
});

// get all images
router.get('/', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.post('/', uploader.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image file provided",
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        // Create a new instance of the Image model
        const bnbImage = new Image({
            image: result.secure_url,
        });

        // Save the image to the database
        const savedImage = await bnbImage.save();

        return res.status(201).json({
            message: "Image uploaded successfully",
            image: savedImage,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to upload image",
            error: error.message,
        });
    }
});



module.exports = router;