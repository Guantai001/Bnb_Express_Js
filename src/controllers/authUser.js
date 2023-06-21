const User = require('../database/schemas/User');
const { hashPassword, comparePassword } = require('../utils/helpers');

// Register user
async function registerUser(req, res) {
    const { name, email, password, registrationMethod } = req.body;
    // Check if the user already exists
    const userDb = await User.findOne({ email });
    if (userDb) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      let newUser;
      if (registrationMethod === 'google') {
        // Registering with Google
        newUser = new GoogleUser({ name, email, googleId: 'generatedGoogleId' });
      } else {
        // Registering with local authentication
        const hashedPassword = await hashPassword(password);
        newUser = new User({ name, email, password: hashedPassword });
      }
      
      await newUser.save();
      return res.status(201).json({ message: "User created successfully" });
    }
  }
  
// Login user
async function loginUser(req, res) {
    const { email, password, loginMethod } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
  
    let userDb;
    if (loginMethod === 'google') {
      // Login with Google
      userDb = await GoogleUser.findOne({ email });
    } else {
      // Login with local authentication
      userDb = await User.findOne({ email });
    }
    
    if (!userDb) {
      return res.status(400).json({ message: "Email or password is incorrect" });
    }
  
    // Perform the password comparison for local authentication only
    if (loginMethod !== 'google') {
      const isMatch = await comparePassword(password, userDb.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }
  
    req.session.user = userDb;
    return res.status(200).json({ message: "Login successful" });
  }
  

// Logout user
async function logoutUser(req, res) {
    req.logout(function (err) {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      req.session.destroy();
      return res.status(200).json({ message: "Logout successful" });
    });
  }

module.exports = { registerUser, loginUser, logoutUser };
