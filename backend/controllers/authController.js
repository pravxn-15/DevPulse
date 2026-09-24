const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const usersFilePath = path.join(__dirname, '../data/users.json');

function getUsersFromFile() {
  try {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  } catch (err) {
    return [];
  }
}

function saveUsersToFile(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
}

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user._id || user.id, name: user.name, email: user.email, gender: user.gender, avatar: user.avatar },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// @desc   Register new user & issue signed JWT
// @route  POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const userGender = gender === 'Female' ? 'Female' : (gender === 'Other' ? 'Other' : 'Male');
    const userAvatar = req.body.avatar || (userGender === 'Female' ? 'female.jpg' : 'male.jpg');

    // Try MongoDB
    try {
      const existingDbUser = await User.findOne({ email: email.toLowerCase() });
      if (existingDbUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const dbUser = await User.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        gender: userGender,
        avatar: userAvatar
      });

      const token = generateToken(dbUser);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully!',
        token,
        user: { 
          id: dbUser._id, 
          name: dbUser.name, 
          email: dbUser.email, 
          gender: dbUser.gender, 
          avatar: dbUser.avatar 
        }
      });
    } catch (dbErr) {}

    // Fallback JSON DB
    const users = getUsersFromFile();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'user_' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      gender: userGender,
      avatar: userAvatar,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsersToFile(users);

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token,
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email, 
        gender: newUser.gender, 
        avatar: newUser.avatar 
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

// @desc   Authenticate user & return JWT token
// @route  POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // Try MongoDB
    try {
      const dbUser = await User.findOne({ email: email.trim().toLowerCase() });
      if (dbUser) {
        const isMatch = await bcrypt.compare(password.trim(), dbUser.password);
        if (isMatch) {
          const token = generateToken(dbUser);
          const defaultAvatar = dbUser.gender === 'Female' ? 'female.jpg' : 'male.jpg';
          return res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: { 
              id: dbUser._id, 
              name: dbUser.name, 
              email: dbUser.email, 
              gender: dbUser.gender || 'Male', 
              avatar: dbUser.avatar || defaultAvatar 
            }
          });
        }
      }
    } catch (dbErr) {}

    // Fallback JSON DB
    const users = getUsersFromFile();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password.trim(), user.password);
    } else {
      isMatch = (user.password === password.trim());
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const defaultAvatar = user.gender === 'Female' ? 'female.jpg' : 'male.jpg';
    if (!user.avatar) user.avatar = defaultAvatar;
    if (!user.gender) user.gender = 'Male';

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        gender: user.gender, 
        avatar: user.avatar 
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

// @desc   Update user profile / avatar
// @route  PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { email, name, avatar, gender } = req.body;
    const userEmail = (email || (req.user && req.user.email) || '').trim().toLowerCase();

    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'User email is required to update profile.' });
    }

    let updatedUser = null;

    // Try MongoDB
    try {
      const dbUser = await User.findOne({ email: userEmail });
      if (dbUser) {
        if (name) dbUser.name = name.trim();
        if (avatar) dbUser.avatar = avatar.trim();
        if (gender) dbUser.gender = gender;
        await dbUser.save();
        updatedUser = {
          id: dbUser._id,
          name: dbUser.name,
          email: dbUser.email,
          gender: dbUser.gender,
          avatar: dbUser.avatar
        };
      }
    } catch (dbErr) {}

    // Update in JSON file fallback
    const users = getUsersFromFile();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === userEmail);

    if (userIndex !== -1) {
      if (name) users[userIndex].name = name.trim();
      if (avatar) users[userIndex].avatar = avatar.trim();
      if (gender) users[userIndex].gender = gender;
      saveUsersToFile(users);

      if (!updatedUser) {
        updatedUser = {
          id: users[userIndex].id,
          name: users[userIndex].name,
          email: users[userIndex].email,
          gender: users[userIndex].gender || 'Male',
          avatar: users[userIndex].avatar || 'male.jpg'
        };
      }
    }

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const token = generateToken(updatedUser);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      token,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating profile.', error: error.message });
  }
};
