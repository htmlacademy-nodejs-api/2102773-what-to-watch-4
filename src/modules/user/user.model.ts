import mongoose from 'mongoose';
import { User } from '../../types/user.type.js';

export interface UserDocument extends User, mongoose.Document {
  createdAt: Date,
  updatedAt: Date,
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
    required: true,
  },
  avatarPath: {
    type: String,
    required: true,
    minlength: [5, 'Min length for avatar path is 5'],
  },
  userName: {
    type: String,
    required: true,
    minlength: [2, 'Min length for firstname is 2']
  },
}, {
  timestamps: true,
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
