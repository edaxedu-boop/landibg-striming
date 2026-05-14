import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function updatePassword() {
  try {
    await mongoose.connect(mongoURI);
    
    const email = 'admin@admin.com';
    const newPassword = 'Admin#RebrandPeru!2024';
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const result = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { upsert: true, new: true }
    );
    
    console.log(`ADMIN_UPDATE_SUCCESS: Admin user ${result.email} updated with new secure password.`);
    process.exit(0);
  } catch (err) {
    console.error('Error updating password:', err);
    process.exit(1);
  }
}

updatePassword();
