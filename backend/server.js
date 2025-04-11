require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://38.242.159.126',
  credentials: true
}));

// Подключение роутов
const userRoutes = require('./routes/userRoutes');
const showRoutes = require('./routes/showRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

// Подключение к MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB database');
});

// Роуты API
app.use('/api/users', userRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is working!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
