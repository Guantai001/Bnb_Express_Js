const User = require('../database/schemas/User');
const {
    hashPassword,
    comparePassword
} = require('../utils/helpers');


// register user
async function registerUser(req, res) {
    const {
        name,
        email,
        password
    } = req.body;
    const userDb = await User.findOne({
        email
    }); // check if user already exists
    if (userDb) {
        return res.status(400).json({
            message: "User already exists"
        });
    } else {
        const password = await hashPassword(req.body.password);
        const newUser = new User({
            name,
            email,
            password
        });
        await newUser.save();
        return res.status(201).json({
            message: "User created successfully"
        });
    }

}


// login user
async function loginUser(req, res) {
    const {
        email,
        password
    } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter all fields"
        });
    }
    const userDb = await User.findOne({
        email
    });
    if (!userDb) {
        return res.status(400).json({
            message: "Email or password is incorrect"
        });
    }
    const isMatch = await comparePassword(password, userDb.password);
    if (isMatch) {
        req.session.user = userDb;
        return res.status(200).json({
            message: "Login successful"
        });
    } else {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }

}

// logout user
async function logoutUser(req, res) {
    req.session.destroy();
    return res.status(200).json({
        message: "Logout successful"
    });
}




module.exports = {registerUser, loginUser};