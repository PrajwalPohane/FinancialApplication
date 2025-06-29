import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  user_id: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  user_id: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(this: any, next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// Generate user_id if not present
userSchema.pre('save', function(this: any, next) {
  if (!this.user_id) {
    this.user_id = 'user_' + Math.random().toString(36).substr(2, 9);
  }
  next();
});

export default mongoose.model<IUser>('User', userSchema); 