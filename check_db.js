import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.MONGODB_URI;

const ProductSchema = new mongoose.Schema({ title: String });
const Product = mongoose.model('Product', ProductSchema);

async function check() {
  try {
    await mongoose.connect(mongoURI);
    const count = await Product.countDocuments();
    console.log(`DATABASE_CHECK_RESULT: ${count} products found`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
