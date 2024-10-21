const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
  
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    user = new User({
      email,
      password: hashedPassword
    });

    
    await user.save();

    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token });
  } catch (err) {
    console.error('Error in registration:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }

  try {

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: User with email ${email} not found.`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed: Incorrect password for user ${email}`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


    console.log(`Login successful for user ${email}`);

  
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
exports.getUser = async (req, res) => {
  try {
  
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsersEmails = async (req, res) => {
  try {
    const users = await User.find({}, 'email'); 
    res.json(users); 
  } catch (err) {
    console.error('Error fetching user emails:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updatePassword = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: 'New password is required' });
  }

  try {
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 10); 
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
