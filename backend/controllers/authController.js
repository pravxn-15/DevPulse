const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper to read users from JSON file fallback
function getJsonUsers() {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveJsonUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving users JSON:', err.message);
  }
}

// @desc   Register new user with hashed password
// @route  POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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

    const normalizedEmail = email.trim().toLowerCase();

    // Check MongoDB if connected
    if (getIsConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists in Database.' });
      }

      const newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: password.trim() // Pre-save hook hashes this with bcryptjs
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully in MongoDB!',
        user: { id: newUser._id, name: newUser.name, email: newUser.email }
      });
    }

    // Hybrid JSON Store Fallback
    const jsonUsers = getJsonUsers();
    const existingJsonUser = jsonUsers.find(u => u.email.toLowerCase() === normalizedEmail);

    if (existingJsonUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.trim(), salt);

    const newUser = {
      id: 'user_' + Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    jsonUsers.push(newUser);
    saveJsonUsers(jsonUsers);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server Registration Error', error: err.message });
  }
};

// @desc   Authenticate user & login using bcrypt
// @route  POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query MongoDB if connected
    if (getIsConnected()) {
      const dbUser = await User.findOne({ email: normalizedEmail });
      if (!dbUser) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await dbUser.matchPassword(password.trim());
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful via MongoDB!',
        user: { id: dbUser._id, name: dbUser.name, email: dbUser.email },
        token: 'mock_jwt_token_' + Date.now()
      });
    }

    // Hybrid JSON Store Fallback with bcrypt comparison
    const jsonUsers = getJsonUsers();
    const user = jsonUsers.find(u => u.email.toLowerCase() === normalizedEmail);

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

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: { id: user.id, name: user.name, email: user.email },
      token: 'mock_jwt_token_' + Date.now()
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: 'Server Login Error', error: err.message });
  }
};
