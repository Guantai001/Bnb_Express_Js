const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('../database/schemas/User');
const Admin = require('../database/schemas/Admin');
const { comparePassword } = require('../utils/helpers');

// User serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, { id: user.id, type: 'user' });
});

passport.deserializeUser(async (data, done) => {
  try {
    if (data.type === 'user') {
      const user = await User.findById(data.id);
      if (!user) {
        throw new Error('User not found');
      }
      done(null, user);
    } else if (data.type === 'admin') {
      const admin = await Admin.findById(data.id);
      if (!admin) {
        throw new Error('Admin not found');
      }
      done(null, admin);
    } else {
      throw new Error('Invalid user type');
    }
  } catch (err) {
    done(err);
  }
});

// User local strategy
passport.use(
  'user-local',
  new Strategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      if (!email || !password) {
        throw new Error('Please enter all fields');
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User does not exist');
      }
      const isMatch = await comparePassword(password, user.password);
      if (isMatch) {
        console.log('User login successful');
        return done(null, { id: user.id, type: 'user' });
      } else {
        return done(null, false, { message: 'Invalid credentials' });
      }
    } catch (err) {
      return done(err);
    }
  })
);

// Admin local strategy
passport.use(
  'admin-local',
  new Strategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      if (!email || !password) {
        throw new Error('Please enter all fields');
      }
      const admin = await Admin.findOne({ email });
      if (!admin) {
        throw new Error('Admin does not exist');
      }
      const isMatch = await comparePassword(password, admin.password);
      if (isMatch) {
        console.log('Admin login successful');
        return done(null, { id: admin.id, type: 'admin' });
      } else {
        return done(null, false, { message: 'Invalid credentials' });
      }
    } catch (err) {
      return done(err);
    }
  })
);

module.exports = passport;
