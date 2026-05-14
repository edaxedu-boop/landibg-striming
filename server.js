import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
console.log('🔗 Intentando conectar a:', mongoURI.replace(/:([^@]+)@/, ':****@'));

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => {
    console.error('❌ Error de conexión:', err);
    console.log('💡 Tip: Asegúrate de que el usuario y contraseña sean correctos y que tu IP esté permitida.');
  });

// Esquema de Producto (Apps y TV)
const ProductSchema = new mongoose.Schema({
  title: String,
  priceUSD: Number,
  pricePEN: Number,
  description: String,
  demoLink: String,
  images: [String],
  category: { type: String, enum: ['apps', 'tv'] },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

// Esquema de Usuario
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Esquema de Testimonio
const TestimonialSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

// Esquema de FAQ
const FAQSchema = new mongoose.Schema({
  emoji: String,
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const FAQ = mongoose.model('FAQ', FAQSchema);

// Esquema de Redes Sociales
const SocialSchema = new mongoose.Schema({
  facebook: String,
  instagram: String,
  youtube: String,
  tiktok: String,
  updatedAt: { type: Date, default: Date.now }
});

const Social = mongoose.model('Social', SocialSchema);

// Rutas API
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rutas para Testimonios
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const newTestimonial = new Testimonial(req.body);
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonio eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rutas para FAQ
app.get('/api/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: 1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/faqs', async (req, res) => {
  try {
    const newFAQ = new FAQ(req.body);
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/faqs/:id', async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rutas para Redes Sociales
app.get('/api/social', async (req, res) => {
  try {
    let social = await Social.findOne();
    if (!social) {
      social = new Social({ facebook: '#', instagram: '#', youtube: '#', tiktok: '#' });
    }
    res.json(social);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/social', async (req, res) => {
  try {
    let social = await Social.findOne();
    if (social) {
      Object.assign(social, req.body);
      social.updatedAt = Date.now();
    } else {
      social = new Social(req.body);
    }
    await social.save();
    res.json(social);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rutas de Autenticación
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    res.json({ success: true, message: 'Autenticación exitosa' });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Ruta temporal para crear el usuario admin
app.post('/api/setup-admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      email,
      password: hashedPassword
    });
    
    await newUser.save();
    res.status(201).json({ message: 'Usuario administrador creado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Iniciar servidor (Solo si no estamos en Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

export default app;
