const {Router} = require('express');
const router = Router();

const passport = require('passport');
const Admin = require('../database/schemas/Admin');
const {hashPassword, comparePassword} = require('../utils/helpers');
const { registerAdmin, loginAdmin } = require('../controllers/authAdmin');

// register admin
router.post('/register',registerAdmin);
// login admin
router.post('/login', loginAdmin);
// logout admin
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({
        message: "Logged out successfully"
    });
});


module.exports = router;

