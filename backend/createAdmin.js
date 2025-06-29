const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Define User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  user_id: { type: String, required: true, unique: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate user_id if not present
userSchema.pre('save', function(next) {
  if (!this.user_id) {
    this.user_id = 'user_' + Math.random().toString(36).substr(2, 9);
  }
  next();
});

const User = mongoose.model('User', userSchema);

async function setupUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Remove admin user if exists
    await User.deleteOne({ email: 'admin@example.com' });
    console.log('Removed admin user if existed.');

    // Create 4 new users
    const users = [
      { email: 'user1@example.com', password: 'password1', name: 'User One', user_id: 'user_001' },
      { email: 'user2@example.com', password: 'password2', name: 'User Two', user_id: 'user_002' },
      { email: 'user3@example.com', password: 'password3', name: 'User Three', user_id: 'user_003' },
      { email: 'user4@example.com', password: 'password4', name: 'User Four', user_id: 'user_004' },
    ];

    for (const userData of users) {
      // Remove if already exists
      await User.deleteOne({ user_id: userData.user_id });
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.email} / ${userData.password} (${userData.user_id})`);
    }

    console.log('User setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up users:', error);
    process.exit(1);
  }
}

setupUsers(); 